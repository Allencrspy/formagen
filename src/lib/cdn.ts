/**
 * Drops a form's pages from the CloudFront cache when it is published, so visitors stop
 * getting the previous version from the edge (usually within a minute). The form pages are
 * otherwise cached at the edge for up to their cache lifetime.
 *
 * The server function can't be told its own distribution id at deploy time (the
 * distribution is created after it), so it looks the id up once by the host it serves.
 */
export type CdnClient = {
  findDistributionId(host: string): Promise<string | null>;
  invalidate(distributionId: string, paths: string[]): Promise<void>;
};

/** One wildcard path: the form, /thanks, /retry, and their ?_rsc variants. */
export const formPaths = (slug: string) => [`/f/${slug}*`];

export function createCdnInvalidator({
  enabled,
  client,
  log = console.error,
}: {
  enabled: boolean;
  client: () => Promise<CdnClient>;
  log?: (message: string, error?: unknown) => void;
}) {
  const ids = new Map<string, Promise<string | null>>();

  return async function invalidateForm(host: string, slug: string): Promise<void> {
    if (!enabled) return;
    try {
      const cdn = await client();
      if (!ids.has(host)) ids.set(host, cdn.findDistributionId(host));
      const id = await ids.get(host)!;
      if (!id) {
        ids.delete(host);
        log(`CDN invalidation skipped: no CloudFront distribution serves ${host}`);
        return;
      }
      await cdn.invalidate(id, formPaths(slug));
    } catch (error) {
      // Publishing already succeeded; the edge copy expires on its own. Don't fail the publish.
      log(`CDN invalidation failed for /f/${slug}`, error);
    }
  };
}

/** The real client, loaded only on AWS so local dev and tests never import the SDK. */
export async function cloudFrontClient(): Promise<CdnClient> {
  const { CloudFrontClient, CreateInvalidationCommand, paginateListDistributions } = await import("@aws-sdk/client-cloudfront");
  const cf = new CloudFrontClient({});
  return {
    async findDistributionId(host) {
      for await (const page of paginateListDistributions({ client: cf }, {})) {
        const match = page.DistributionList?.Items?.find((d) => d.DomainName === host || d.Aliases?.Items?.includes(host));
        if (match?.Id) return match.Id;
      }
      return null;
    },
    async invalidate(distributionId, paths) {
      await cf.send(
        new CreateInvalidationCommand({
          DistributionId: distributionId,
          InvalidationBatch: { CallerReference: `${Date.now()}-${paths.join(",")}`, Paths: { Quantity: paths.length, Items: paths } },
        }),
      );
    },
  };
}

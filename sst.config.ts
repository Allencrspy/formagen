// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

/**
 * AWS infrastructure as code. `npx sst deploy --stage dev` builds the app with OpenNext
 * and deploys it to Lambda (server rendering, API routes) behind CloudFront (CDN),
 * with static assets in S3. Region ap-southeast-2 (Sydney): the one full-service region on this AWS Free-plan account.
 */
export default $config({
  app(input) {
    return {
      name: "formagen",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: { aws: { region: "ap-southeast-2", profile: "formagen" } },
    };
  },
  async run() {
    // Secrets live encrypted in AWS SSM, set per stage with `npx sst secret set`.
    const databaseUrl = new sst.Secret("DatabaseUrl"); // Neon POOLED url: Lambda scales out
    const authSecret = new sst.Secret("AuthSecret");
    const githubId = new sst.Secret("GithubId");
    const githubSecret = new sst.Secret("GithubSecret");

    const web = new sst.aws.Nextjs("Web", {
      // SST 4.17 pins OpenNext 3.9.14, which serves Next 16's prerendered shell without
      // the request-time content; 4.x adds Next 16 support.
      openNextVersion: "4.1.16",
      environment: {
        DATABASE_URL: databaseUrl.value,
        AUTH_SECRET: authSecret.value,
        AUTH_GITHUB_ID: githubId.value,
        AUTH_GITHUB_SECRET: githubSecret.value,
        AUTH_TRUST_HOST: "true", // behind CloudFront, Auth.js must trust the forwarded host
        CDN_INVALIDATION: "cloudfront", // publishing drops the form's pages from the edge cache
      },
      // Publishing looks up this app's distribution by host and invalidates /f/<slug>*.
      permissions: [{ actions: ["cloudfront:ListDistributions", "cloudfront:CreateInvalidation"], resources: ["*"] }],
    });

    return { url: web.url };
  },
});

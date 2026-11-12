// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

/**
 * AWS infrastructure as code. `npx sst deploy --stage dev` builds the app with OpenNext
 * and deploys it to Lambda (server rendering, API routes) behind CloudFront (CDN),
 * with static assets in S3. Region ap-south-1 (Mumbai) sits next to the Neon database.
 */
export default $config({
  app(input) {
    return {
      name: "formagen",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: { aws: { region: "ap-south-1", profile: "formagen" } },
    };
  },
  async run() {
    // Secrets live encrypted in AWS SSM, set per stage with `npx sst secret set`.
    const databaseUrl = new sst.Secret("DatabaseUrl"); // Neon POOLED url: Lambda scales out
    const authSecret = new sst.Secret("AuthSecret");
    const githubId = new sst.Secret("GithubId");
    const githubSecret = new sst.Secret("GithubSecret");

    const web = new sst.aws.Nextjs("Web", {
      environment: {
        DATABASE_URL: databaseUrl.value,
        AUTH_SECRET: authSecret.value,
        AUTH_GITHUB_ID: githubId.value,
        AUTH_GITHUB_SECRET: githubSecret.value,
        AUTH_TRUST_HOST: "true", // behind CloudFront, Auth.js must trust the forwarded host
      },
    });

    return { url: web.url };
  },
});

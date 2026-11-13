import { graphql } from "@/graphql/generated";

export const ResponsesQuery = graphql(`
  query FormResponses($id: ID!, $versionId: ID, $page: Int!) {
    form(id: $id) {
      id
      title
      slug
      versions {
        id
        version
        schema
        publishedAt
      }
      responses(versionId: $versionId, page: $page) {
        total
        items {
          id
          version
          answers
          submittedAt
        }
      }
    }
  }
`);

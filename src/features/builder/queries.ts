import { graphql } from "@/graphql/generated";

export const FormsListQuery = graphql(`
  query FormsList {
    forms {
      id
      title
      slug
      latestVersion
      responseCount
      updatedAt
    }
  }
`);

export const CreateFormMutation = graphql(`
  mutation CreateForm($title: String!) {
    createForm(title: $title) {
      id
    }
  }
`);

export const BuilderFormQuery = graphql(`
  query BuilderForm($id: ID!) {
    form(id: $id) {
      id
      title
      slug
      draftSchema
      latestVersion
      responseCount
    }
  }
`);

export const UpdateDraftMutation = graphql(`
  mutation UpdateDraft($id: ID!, $schema: JSON!) {
    updateDraft(id: $id, schema: $schema) {
      ok
      issues {
        fieldId
        message
      }
    }
  }
`);

export const PublishFormMutation = graphql(`
  mutation PublishForm($id: ID!) {
    publishForm(id: $id) {
      version
      publishedAt
    }
  }
`);

/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query FormsList {\n    forms {\n      id\n      title\n      slug\n      latestVersion\n      responseCount\n      updatedAt\n    }\n  }\n": typeof types.FormsListDocument,
    "\n  mutation CreateForm($title: String!) {\n    createForm(title: $title) {\n      id\n    }\n  }\n": typeof types.CreateFormDocument,
    "\n  query BuilderForm($id: ID!) {\n    form(id: $id) {\n      id\n      title\n      slug\n      draftSchema\n      latestVersion\n      responseCount\n    }\n  }\n": typeof types.BuilderFormDocument,
    "\n  mutation UpdateDraft($id: ID!, $schema: JSON!) {\n    updateDraft(id: $id, schema: $schema) {\n      ok\n      issues {\n        fieldId\n        message\n      }\n    }\n  }\n": typeof types.UpdateDraftDocument,
    "\n  mutation PublishForm($id: ID!) {\n    publishForm(id: $id) {\n      version\n      publishedAt\n    }\n  }\n": typeof types.PublishFormDocument,
};
const documents: Documents = {
    "\n  query FormsList {\n    forms {\n      id\n      title\n      slug\n      latestVersion\n      responseCount\n      updatedAt\n    }\n  }\n": types.FormsListDocument,
    "\n  mutation CreateForm($title: String!) {\n    createForm(title: $title) {\n      id\n    }\n  }\n": types.CreateFormDocument,
    "\n  query BuilderForm($id: ID!) {\n    form(id: $id) {\n      id\n      title\n      slug\n      draftSchema\n      latestVersion\n      responseCount\n    }\n  }\n": types.BuilderFormDocument,
    "\n  mutation UpdateDraft($id: ID!, $schema: JSON!) {\n    updateDraft(id: $id, schema: $schema) {\n      ok\n      issues {\n        fieldId\n        message\n      }\n    }\n  }\n": types.UpdateDraftDocument,
    "\n  mutation PublishForm($id: ID!) {\n    publishForm(id: $id) {\n      version\n      publishedAt\n    }\n  }\n": types.PublishFormDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FormsList {\n    forms {\n      id\n      title\n      slug\n      latestVersion\n      responseCount\n      updatedAt\n    }\n  }\n"): typeof import('./graphql').FormsListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateForm($title: String!) {\n    createForm(title: $title) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateFormDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BuilderForm($id: ID!) {\n    form(id: $id) {\n      id\n      title\n      slug\n      draftSchema\n      latestVersion\n      responseCount\n    }\n  }\n"): typeof import('./graphql').BuilderFormDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateDraft($id: ID!, $schema: JSON!) {\n    updateDraft(id: $id, schema: $schema) {\n      ok\n      issues {\n        fieldId\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').UpdateDraftDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PublishForm($id: ID!) {\n    publishForm(id: $id) {\n      version\n      publishedAt\n    }\n  }\n"): typeof import('./graphql').PublishFormDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

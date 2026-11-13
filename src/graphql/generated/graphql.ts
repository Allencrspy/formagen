/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type FormsListQueryVariables = Exact<{ [key: string]: never; }>;


export type FormsListQuery = { forms: Array<{ id: string, title: string, slug: string, latestVersion: number | null, responseCount: number, updatedAt: string }> };

export type CreateFormMutationVariables = Exact<{
  title: string;
}>;


export type CreateFormMutation = { createForm: { id: string } };

export type BuilderFormQueryVariables = Exact<{
  id: string | number;
}>;


export type BuilderFormQuery = { form: { id: string, title: string, slug: string, draftSchema: unknown, latestVersion: number | null, responseCount: number } };

export type UpdateDraftMutationVariables = Exact<{
  id: string | number;
  schema: unknown;
}>;


export type UpdateDraftMutation = { updateDraft: { ok: boolean, issues: Array<{ fieldId: string | null, message: string }> } };

export type PublishFormMutationVariables = Exact<{
  id: string | number;
}>;


export type PublishFormMutation = { publishForm: { version: number, publishedAt: string } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const FormsListDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<FormsListQuery, FormsListQueryVariables>;
export const CreateFormDocument = new TypedDocumentString(`
    mutation CreateForm($title: String!) {
  createForm(title: $title) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateFormMutation, CreateFormMutationVariables>;
export const BuilderFormDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<BuilderFormQuery, BuilderFormQueryVariables>;
export const UpdateDraftDocument = new TypedDocumentString(`
    mutation UpdateDraft($id: ID!, $schema: JSON!) {
  updateDraft(id: $id, schema: $schema) {
    ok
    issues {
      fieldId
      message
    }
  }
}
    `) as unknown as TypedDocumentString<UpdateDraftMutation, UpdateDraftMutationVariables>;
export const PublishFormDocument = new TypedDocumentString(`
    mutation PublishForm($id: ID!) {
  publishForm(id: $id) {
    version
    publishedAt
  }
}
    `) as unknown as TypedDocumentString<PublishFormMutation, PublishFormMutationVariables>;
/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      accessToken\n      refreshToken\n    }\n  }\n": types.LoginDocument,
    "#graphql\n  mutation UpdateUser ($updateUserInput: UpdateUserInput!) {\n    updateUser(updateUserInput: $updateUserInput){\n      email\n    }\n  }\n": types.UpdateUserDocument,
    "#graphql\n  mutation CreateCategory($createCategoryInput: CreateCategoryInput!){\n      createCategory(createCategoryInput: $createCategoryInput) {\n        id\n      }\n    }\n": types.CreateCategoryDocument,
    "#graphql\n  mutation SignUp($signUpInput: SignupInput!) {\n    signup(data: $signUpInput) {\n      user {\n        id\n        email\n      }\n    }\n  }\n": types.SignUpDocument,
    "#graphql\n  query GetCategories($take: Int, $skip: Int) {\n    categories (take: $take, skip: $skip) {\n      nodes {\n        id \n        name\n      }\n      pageInfo {\n        endCursor \n        totalCount\n      }\n    }\n  }\n": types.GetCategoriesDocument,
    "#graphql\n   query GetUser($id: String!) {\n      user(id: $id) {\n         id  \n         email\n         profile {\n            nickname\n            phone\n         }\n      }\n   }\n": types.GetUserDocument,
    "#graphql\n  query GetUsers($email: String, $skip: Int, $take: Int, $sortingKey: String, $sortingValue: String) {\n    users(email: $email, skip: $skip, take: $take, sortingKey: $sortingKey, sortingValue: $sortingValue) {\n      nodes {\n        id\n        id\n        email\n        profile {\n          id\n          nickname\n          phone\n        }\n      }\n      pageInfo {\n        endCursor\n        totalCount\n      }\n    }\n  }\n": types.GetUsersDocument,
    "#graphql\n  query GetWorkspace($id: String!) {\n    workspace(id: $id) {\n      name\n    }\n  }\n": types.GetWorkspaceDocument,
    "\n  query GetWorkspaces($take: Int, $skip: Int) {\n    workspaces(take: $take, skip: $skip) {\n      nodes {\n        name\n        owner {\n          email\n        }\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n": types.GetWorkspacesDocument,
    "#graphql\n    query GetCategoryForm($id: String!) {\n      categoryForm(id: $id) {\n        name\n        categoryItemId\n      } \n    }\n": types.GetCategoryFormDocument,
    "#graphql\n  query GetUserForm($id: String!){\n    userForm(id: $id) {\n      email\n      password\n      profile {\n        nickname\n        phone\n      }\n    }\n  }\n": types.GetUserFormDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation UpdateUser ($updateUserInput: UpdateUserInput!) {\n    updateUser(updateUserInput: $updateUserInput){\n      email\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation UpdateUser ($updateUserInput: UpdateUserInput!) {\n    updateUser(updateUserInput: $updateUserInput){\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation CreateCategory($createCategoryInput: CreateCategoryInput!){\n      createCategory(createCategoryInput: $createCategoryInput) {\n        id\n      }\n    }\n"): (typeof documents)["#graphql\n  mutation CreateCategory($createCategoryInput: CreateCategoryInput!){\n      createCategory(createCategoryInput: $createCategoryInput) {\n        id\n      }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation SignUp($signUpInput: SignupInput!) {\n    signup(data: $signUpInput) {\n      user {\n        id\n        email\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation SignUp($signUpInput: SignupInput!) {\n    signup(data: $signUpInput) {\n      user {\n        id\n        email\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query GetCategories($take: Int, $skip: Int) {\n    categories (take: $take, skip: $skip) {\n      nodes {\n        id \n        name\n      }\n      pageInfo {\n        endCursor \n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetCategories($take: Int, $skip: Int) {\n    categories (take: $take, skip: $skip) {\n      nodes {\n        id \n        name\n      }\n      pageInfo {\n        endCursor \n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n   query GetUser($id: String!) {\n      user(id: $id) {\n         id  \n         email\n         profile {\n            nickname\n            phone\n         }\n      }\n   }\n"): (typeof documents)["#graphql\n   query GetUser($id: String!) {\n      user(id: $id) {\n         id  \n         email\n         profile {\n            nickname\n            phone\n         }\n      }\n   }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query GetUsers($email: String, $skip: Int, $take: Int, $sortingKey: String, $sortingValue: String) {\n    users(email: $email, skip: $skip, take: $take, sortingKey: $sortingKey, sortingValue: $sortingValue) {\n      nodes {\n        id\n        id\n        email\n        profile {\n          id\n          nickname\n          phone\n        }\n      }\n      pageInfo {\n        endCursor\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetUsers($email: String, $skip: Int, $take: Int, $sortingKey: String, $sortingValue: String) {\n    users(email: $email, skip: $skip, take: $take, sortingKey: $sortingKey, sortingValue: $sortingValue) {\n      nodes {\n        id\n        id\n        email\n        profile {\n          id\n          nickname\n          phone\n        }\n      }\n      pageInfo {\n        endCursor\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query GetWorkspace($id: String!) {\n    workspace(id: $id) {\n      name\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetWorkspace($id: String!) {\n    workspace(id: $id) {\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspaces($take: Int, $skip: Int) {\n    workspaces(take: $take, skip: $skip) {\n      nodes {\n        name\n        owner {\n          email\n        }\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspaces($take: Int, $skip: Int) {\n    workspaces(take: $take, skip: $skip) {\n      nodes {\n        name\n        owner {\n          email\n        }\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n    query GetCategoryForm($id: String!) {\n      categoryForm(id: $id) {\n        name\n        categoryItemId\n      } \n    }\n"): (typeof documents)["#graphql\n    query GetCategoryForm($id: String!) {\n      categoryForm(id: $id) {\n        name\n        categoryItemId\n      } \n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query GetUserForm($id: String!){\n    userForm(id: $id) {\n      email\n      password\n      profile {\n        nickname\n        phone\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetUserForm($id: String!){\n    userForm(id: $id) {\n      email\n      password\n      profile {\n        nickname\n        phone\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
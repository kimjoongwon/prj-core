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
    "#graphql\n  mutation SignUp($signUpInput: SignupInput!) {\n    signup(data: $signUpInput) {\n      user {\n        id\n        email\n      }\n    }\n  }\n": types.SignUpDocument,
    "\n  #graphql\n  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {\n    createCategory(createCategoryInput: $createCategoryInput) {\n      id\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  #graphql\n  mutation DeleteCategories($ids: [String!]!) {\n    deleteCategories(ids: $ids) {\n      name\n    }\n  }\n": types.DeleteCategoriesDocument,
    "\n  mutation RemoveCategory($id: String!) {\n    removeCategory(id: $id) {\n      id\n    }\n  }\n": types.RemoveCategoryDocument,
    "\n  mutation updateCategory($updateCategoryInput: UpdateCategoryInput!) {\n    updateCategory(updateCategoryInput: $updateCategoryInput) {\n      id\n    }\n  }\n": types.UpdateCategoryDocument,
    "\n  mutation CreateCategoryItem($createCategoryItemInput: CreateCategoryItemInput!) {\n    createCategoryItem(createCategoryItemInput: $createCategoryItemInput) {\n      id\n      name\n      parentId\n    }\n  }\n": types.CreateCategoryItemDocument,
    "\n  #graphql\n  mutation DeleteCategoryItem($id: String!) {\n    deleteCategoryItem(id: $id) {\n      id\n      name\n      deletedAt\n    }\n  }\n": types.DeleteCategoryItemDocument,
    "\n  #graphql\n  mutation UpdateCategoryItem($updateCategoryItemInput: UpdateCategoryItemInput!) {\n    updateCategoryItem(updateCategoryItemInput: $updateCategoryItemInput) {\n      id\n      name\n      deletedAt\n    }\n  }\n": types.UpdateCategoryItemDocument,
    "\n  mutation CreateRole($createRoleInput: CreateRoleInput!) {\n    createRole(createRoleInput: $createRoleInput) {\n      name\n    }\n  }\n": types.CreateRoleDocument,
    "\n  mutation DeleteRole($id: String!) {\n    deleteRole(id: $id) {\n      id\n    }\n  }\n": types.DeleteRoleDocument,
    "\n  mutation UpdateRole($updateRoleInput: UpdateRoleInput!) {\n    updateRole(updateRoleInput: $updateRoleInput) {\n      id\n    }\n  }\n": types.UpdateRoleDocument,
    "\n  mutation CreateService($createServiceInput: CreateServiceInput!) {\n    createService(createServiceInput: $createServiceInput) {\n      id\n      name\n    }\n  }\n": types.CreateServiceDocument,
    "\n  mutation DeleteService($id: String!) {\n    deleteService(id: $id) {\n      id\n    }\n  }\n": types.DeleteServiceDocument,
    "\n  mutation UpdateService($updateServiceInput: UpdateServiceInput!) {\n    updateService(updateServiceInput: $updateServiceInput) {\n      id\n      name\n    }\n  }\n": types.UpdateServiceDocument,
    "#graphql\n  mutation UpdateUser ($updateUserInput: UpdateUserInput!) {\n    updateUser(updateUserInput: $updateUserInput){\n      email\n    }\n  }\n": types.UpdateUserDocument,
    "\n  mutation CreateWorkspace($createWorkspaceInput: CreateWorkspaceInput!) {\n    createWorkspace(createWorkspaceInput: $createWorkspaceInput) {\n      name\n    }\n  }\n": types.CreateWorkspaceDocument,
    "\n  mutation DeleteWorkspace($id: String!) {\n    deleteWorkspace(id: $id) {\n      id\n    }\n  }\n": types.DeleteWorkspaceDocument,
    "\n  mutation UpdateWorkspace($updateWorkspaceInput: UpdateWorkspaceInput!) {\n    updateWorkspace(updateWorkspaceInput: $updateWorkspaceInput) {\n      id\n    }\n  }\n": types.UpdateWorkspaceDocument,
    "#graphql\n  query GetCategories($take: Int, $skip: Int) {\n    categories (take: $take, skip: $skip) {\n      nodes {\n        id \n        name\n        deletedAt\n      }\n      pageInfo {\n        endCursor \n        totalCount\n      }\n    }\n  }\n": types.GetCategoriesDocument,
    "\n  query GetCategory($id: String!) {\n    category(id: $id) {\n      id\n      name\n      itemId\n    }\n  }\n": types.GetCategoryDocument,
    "\n  #graphql\n  query GetCategoryForm($id: String!) {\n    categoryForm(id: $id) {\n      name\n      itemId\n      serviceId\n      itemOptions {\n        name\n        value\n      }\n      serviceOptions {\n        name\n        value\n      }\n    }\n  }\n": types.GetCategoryFormDocument,
    "\n  #graphql\n  query GetCategoryItem ($id: String!){\n    categoryItem (id: $id) {\n      id\n      name\n      parentId\n    }\n  }\n": types.GetCategoryItemDocument,
    "\n  #graphql\n  query GetCategoryItems(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    categoryItems(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        name\n      }\n      pageInfo {\n        endCursor\n        totalCount\n      }\n    }\n  }\n": types.GetCategoryItemsDocument,
    "\n  #graphql\n  query GetCategoryItemForm($id: String!) {\n    categoryItemForm(id: $id) {\n      name\n      ancestorIds\n      parentId\n      tag\n    }\n  }\n": types.GetCategoryItemFormDocument,
    "#graphql\n  query GetCategoryItemTrees {\n    categoryItemTrees {\n      id\n      name\n      tag\n      ancestorIds\n      parentId\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n": types.GetCategoryItemTreesDocument,
    "\n  query GetRole($id: String!){\n    role(id: $id) {\n      id\n    }\n  }\n": types.GetRoleDocument,
    "\n  #graphql\n  query GetRoles(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    roles(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n": types.GetRolesDocument,
    "\n  query GetRoleForm {\n    roleForm {\n      name\n    }\n  }\n": types.GetRoleFormDocument,
    "\n  query GetService($id: String!) {\n    service(id: $id) {\n      id\n      name\n    }\n  }\n": types.GetServiceDocument,
    "\n  #graphql\n  query GetServices(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    services(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n": types.GetServicesDocument,
    "\n  query GetServiceForm {\n    serviceForm {\n      name\n    }\n  }\n": types.GetServiceFormDocument,
    "\n  query GetUser($id: String!) {\n    user(id: $id) {\n      id\n      email\n      profile {\n        nickname\n        phone\n      }\n    }\n  }\n": types.GetUserDocument,
    "#graphql\n  query GetUsers(\n    $email: String\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    users(\n      email: $email\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        email\n        profile {\n          id\n          nickname\n          phone\n        }\n      }\n      pageInfo {\n        endCursor\n        totalCount\n      }\n    }\n  }\n": types.GetUsersDocument,
    "#graphql\n  query GetUserForm($id: String!){\n    userForm(id: $id) {\n      email\n      password\n      profile {\n        nickname\n        phone\n      }\n    }\n  }\n": types.GetUserFormDocument,
    "\n  query GetWorkspace($id: String!){\n    workspace(id: $id) {\n      id\n    }\n  }\n": types.GetWorkspaceDocument,
    "\n  #graphql\n  query GetWorkspaces(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    workspaces(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n": types.GetWorkspacesDocument,
    "\n  query GetWorkspaceForm($id: String!) {\n    workspaceForm(id: $id) {\n      name\n    }\n  }\n": types.GetWorkspaceFormDocument,
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
export function gql(source: "#graphql\n  mutation SignUp($signUpInput: SignupInput!) {\n    signup(data: $signUpInput) {\n      user {\n        id\n        email\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation SignUp($signUpInput: SignupInput!) {\n    signup(data: $signUpInput) {\n      user {\n        id\n        email\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {\n    createCategory(createCategoryInput: $createCategoryInput) {\n      id\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {\n    createCategory(createCategoryInput: $createCategoryInput) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  mutation DeleteCategories($ids: [String!]!) {\n    deleteCategories(ids: $ids) {\n      name\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  mutation DeleteCategories($ids: [String!]!) {\n    deleteCategories(ids: $ids) {\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveCategory($id: String!) {\n    removeCategory(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveCategory($id: String!) {\n    removeCategory(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation updateCategory($updateCategoryInput: UpdateCategoryInput!) {\n    updateCategory(updateCategoryInput: $updateCategoryInput) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation updateCategory($updateCategoryInput: UpdateCategoryInput!) {\n    updateCategory(updateCategoryInput: $updateCategoryInput) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateCategoryItem($createCategoryItemInput: CreateCategoryItemInput!) {\n    createCategoryItem(createCategoryItemInput: $createCategoryItemInput) {\n      id\n      name\n      parentId\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCategoryItem($createCategoryItemInput: CreateCategoryItemInput!) {\n    createCategoryItem(createCategoryItemInput: $createCategoryItemInput) {\n      id\n      name\n      parentId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  mutation DeleteCategoryItem($id: String!) {\n    deleteCategoryItem(id: $id) {\n      id\n      name\n      deletedAt\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  mutation DeleteCategoryItem($id: String!) {\n    deleteCategoryItem(id: $id) {\n      id\n      name\n      deletedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  mutation UpdateCategoryItem($updateCategoryItemInput: UpdateCategoryItemInput!) {\n    updateCategoryItem(updateCategoryItemInput: $updateCategoryItemInput) {\n      id\n      name\n      deletedAt\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  mutation UpdateCategoryItem($updateCategoryItemInput: UpdateCategoryItemInput!) {\n    updateCategoryItem(updateCategoryItemInput: $updateCategoryItemInput) {\n      id\n      name\n      deletedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateRole($createRoleInput: CreateRoleInput!) {\n    createRole(createRoleInput: $createRoleInput) {\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateRole($createRoleInput: CreateRoleInput!) {\n    createRole(createRoleInput: $createRoleInput) {\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteRole($id: String!) {\n    deleteRole(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteRole($id: String!) {\n    deleteRole(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateRole($updateRoleInput: UpdateRoleInput!) {\n    updateRole(updateRoleInput: $updateRoleInput) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateRole($updateRoleInput: UpdateRoleInput!) {\n    updateRole(updateRoleInput: $updateRoleInput) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateService($createServiceInput: CreateServiceInput!) {\n    createService(createServiceInput: $createServiceInput) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateService($createServiceInput: CreateServiceInput!) {\n    createService(createServiceInput: $createServiceInput) {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteService($id: String!) {\n    deleteService(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteService($id: String!) {\n    deleteService(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateService($updateServiceInput: UpdateServiceInput!) {\n    updateService(updateServiceInput: $updateServiceInput) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateService($updateServiceInput: UpdateServiceInput!) {\n    updateService(updateServiceInput: $updateServiceInput) {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation UpdateUser ($updateUserInput: UpdateUserInput!) {\n    updateUser(updateUserInput: $updateUserInput){\n      email\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation UpdateUser ($updateUserInput: UpdateUserInput!) {\n    updateUser(updateUserInput: $updateUserInput){\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateWorkspace($createWorkspaceInput: CreateWorkspaceInput!) {\n    createWorkspace(createWorkspaceInput: $createWorkspaceInput) {\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateWorkspace($createWorkspaceInput: CreateWorkspaceInput!) {\n    createWorkspace(createWorkspaceInput: $createWorkspaceInput) {\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteWorkspace($id: String!) {\n    deleteWorkspace(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteWorkspace($id: String!) {\n    deleteWorkspace(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateWorkspace($updateWorkspaceInput: UpdateWorkspaceInput!) {\n    updateWorkspace(updateWorkspaceInput: $updateWorkspaceInput) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateWorkspace($updateWorkspaceInput: UpdateWorkspaceInput!) {\n    updateWorkspace(updateWorkspaceInput: $updateWorkspaceInput) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query GetCategories($take: Int, $skip: Int) {\n    categories (take: $take, skip: $skip) {\n      nodes {\n        id \n        name\n        deletedAt\n      }\n      pageInfo {\n        endCursor \n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetCategories($take: Int, $skip: Int) {\n    categories (take: $take, skip: $skip) {\n      nodes {\n        id \n        name\n        deletedAt\n      }\n      pageInfo {\n        endCursor \n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetCategory($id: String!) {\n    category(id: $id) {\n      id\n      name\n      itemId\n    }\n  }\n"): (typeof documents)["\n  query GetCategory($id: String!) {\n    category(id: $id) {\n      id\n      name\n      itemId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetCategoryForm($id: String!) {\n    categoryForm(id: $id) {\n      name\n      itemId\n      serviceId\n      itemOptions {\n        name\n        value\n      }\n      serviceOptions {\n        name\n        value\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetCategoryForm($id: String!) {\n    categoryForm(id: $id) {\n      name\n      itemId\n      serviceId\n      itemOptions {\n        name\n        value\n      }\n      serviceOptions {\n        name\n        value\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetCategoryItem ($id: String!){\n    categoryItem (id: $id) {\n      id\n      name\n      parentId\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetCategoryItem ($id: String!){\n    categoryItem (id: $id) {\n      id\n      name\n      parentId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetCategoryItems(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    categoryItems(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        name\n      }\n      pageInfo {\n        endCursor\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetCategoryItems(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    categoryItems(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        name\n      }\n      pageInfo {\n        endCursor\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetCategoryItemForm($id: String!) {\n    categoryItemForm(id: $id) {\n      name\n      ancestorIds\n      parentId\n      tag\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetCategoryItemForm($id: String!) {\n    categoryItemForm(id: $id) {\n      name\n      ancestorIds\n      parentId\n      tag\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query GetCategoryItemTrees {\n    categoryItemTrees {\n      id\n      name\n      tag\n      ancestorIds\n      parentId\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetCategoryItemTrees {\n    categoryItemTrees {\n      id\n      name\n      tag\n      ancestorIds\n      parentId\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetRole($id: String!){\n    role(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  query GetRole($id: String!){\n    role(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetRoles(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    roles(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetRoles(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    roles(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetRoleForm {\n    roleForm {\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetRoleForm {\n    roleForm {\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetService($id: String!) {\n    service(id: $id) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetService($id: String!) {\n    service(id: $id) {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetServices(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    services(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetServices(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    services(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetServiceForm {\n    serviceForm {\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetServiceForm {\n    serviceForm {\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUser($id: String!) {\n    user(id: $id) {\n      id\n      email\n      profile {\n        nickname\n        phone\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUser($id: String!) {\n    user(id: $id) {\n      id\n      email\n      profile {\n        nickname\n        phone\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query GetUsers(\n    $email: String\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    users(\n      email: $email\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        email\n        profile {\n          id\n          nickname\n          phone\n        }\n      }\n      pageInfo {\n        endCursor\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetUsers(\n    $email: String\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    users(\n      email: $email\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        email\n        profile {\n          id\n          nickname\n          phone\n        }\n      }\n      pageInfo {\n        endCursor\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query GetUserForm($id: String!){\n    userForm(id: $id) {\n      email\n      password\n      profile {\n        nickname\n        phone\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetUserForm($id: String!){\n    userForm(id: $id) {\n      email\n      password\n      profile {\n        nickname\n        phone\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspace($id: String!){\n    workspace(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspace($id: String!){\n    workspace(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetWorkspaces(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    workspaces(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetWorkspaces(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    workspaces(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspaceForm($id: String!) {\n    workspaceForm(id: $id) {\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspaceForm($id: String!) {\n    workspaceForm(id: $id) {\n      name\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
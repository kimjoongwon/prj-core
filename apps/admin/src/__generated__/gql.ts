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
    "\n  mutation CreateGroup($createGroupInput: CreateGroupInput!) {\n    createGroup(createGroupInput: $createGroupInput) {\n      name\n    }\n  }\n": types.CreateGroupDocument,
    "\n  mutation DeleteGroup($id: String!) {\n    deleteGroup(id: $id) {\n      id\n    }\n  }\n": types.DeleteGroupDocument,
    "\n  mutation UpdateGroup($updateGroupInput: UpdateGroupInput!) {\n    updateGroup(updateGroupInput: $updateGroupInput) {\n      id\n    }\n  }\n": types.UpdateGroupDocument,
    "\n  mutation CreateRole($createRoleInput: CreateRoleInput!) {\n    createRole(createRoleInput: $createRoleInput) {\n      id\n    }\n  }\n": types.CreateRoleDocument,
    "\n  mutation DeleteRole($id: String!) {\n    deleteRole(id: $id) {\n      id\n    }\n  }\n": types.DeleteRoleDocument,
    "\n  mutation RemoveRole($id: String!) {\n    removeRole(id: $id) {\n      id\n    }\n  }\n": types.RemoveRoleDocument,
    "\n  mutation UpdateRole($updateRoleInput: UpdateRoleInput!) {\n    updateRole(updateRoleInput: $updateRoleInput) {\n      id\n    }\n  }\n": types.UpdateRoleDocument,
    "\n  mutation CreateService($createServiceInput: CreateServiceInput!) {\n    createService(createServiceInput: $createServiceInput) {\n      id\n      name\n    }\n  }\n": types.CreateServiceDocument,
    "\n  mutation DeleteService($id: String!) {\n    deleteService(id: $id) {\n      id\n    }\n  }\n": types.DeleteServiceDocument,
    "\n  mutation UpdateService($updateServiceInput: UpdateServiceInput!) {\n    updateService(updateServiceInput: $updateServiceInput) {\n      id\n      name\n    }\n  }\n": types.UpdateServiceDocument,
    "\n  mutation CreateSession($createSessionInput: CreateSessionInput!) {\n    createSession(createSessionInput: $createSessionInput) {\n      name\n    }\n  }\n": types.CreateSessionDocument,
    "\n  mutation DeleteSession($id: String!) {\n    deleteSession(id: $id) {\n      id\n    }\n  }\n": types.DeleteSessionDocument,
    "\n  mutation UpdateSession($updateSessionInput: UpdateSessionInput!) {\n    updateSession(updateSessionInput: $updateSessionInput) {\n      id\n    }\n  }\n": types.UpdateSessionDocument,
    "\n  mutation CreateSpace($createSpaceInput: CreateSpaceInput!) {\n    createSpace(createSpaceInput: $createSpaceInput) {\n      name\n    }\n  }\n": types.CreateSpaceDocument,
    "\n  mutation DeleteSpace($id: String!) {\n    deleteSpace(id: $id) {\n      id\n    }\n  }\n": types.DeleteSpaceDocument,
    "\n  mutation UpdateSpace($updateSpaceInput: UpdateSpaceInput!) {\n    updateSpace(updateSpaceInput: $updateSpaceInput) {\n      id\n    }\n  }\n": types.UpdateSpaceDocument,
    "\n  mutation CreateTimelineItem($createTimelineItemInput: CreateTimelineItemInput!) {\n    createTimelineItem(createTimelineItemInput: $createTimelineItemInput) {\n      description\n      title\n    }\n  }\n": types.CreateTimelineItemDocument,
    "\n  mutation DeleteTimelineItem($id: String!) {\n    deleteTimelineItem(id: $id) {\n      id\n    }\n  }\n": types.DeleteTimelineItemDocument,
    "\n  mutation UpdateTimelineItem($updateTimelineItemInput: UpdateTimelineItemInput!) {\n    updateTimelineItem(updateTimelineItemInput: $updateTimelineItemInput) {\n      id\n    }\n  }\n": types.UpdateTimelineItemDocument,
    "\n  mutation CreateTimeline($createTimelineInput: CreateTimelineInput!) {\n    createTimeline(createTimelineInput: $createTimelineInput) {\n      date\n    }\n  }\n": types.CreateTimelineDocument,
    "\n  mutation DeleteTimeline($id: String!) {\n    deleteTimeline(id: $id) {\n      id\n    }\n  }\n": types.DeleteTimelineDocument,
    "\n  mutation UpdateTimeline($updateTimelineInput: UpdateTimelineInput!) {\n    updateTimeline(updateTimelineInput: $updateTimelineInput) {\n      id\n    }\n  }\n": types.UpdateTimelineDocument,
    "\n  mutation CreateUser($createUserInput: CreateUserInput!) {\n    createUser(createUserInput: $createUserInput) {\n      id\n      name\n      email\n    }\n  }\n": types.CreateUserDocument,
    "#graphql\n  mutation UpdateUser ($updateUserInput: UpdateUserInput!) {\n    updateUser(updateUserInput: $updateUserInput){\n      email\n    }\n  }\n": types.UpdateUserDocument,
    "#graphql\n  query GetCategories($take: Int, $skip: Int) {\n    categories (take: $take, skip: $skip) {\n      nodes {\n        id \n        name\n        deletedAt\n      }\n      pageInfo {\n        endCursor \n        totalCount\n      }\n    }\n  }\n": types.GetCategoriesDocument,
    "\n  query GetCategory($id: String!) {\n    category(id: $id) {\n      id\n      name\n    }\n  }\n": types.GetCategoryDocument,
    "\n  #graphql\n  query GetCategoryForm($id: String!) {\n    categoryForm(id: $id) {\n      name\n      itemId\n      serviceId\n      itemOptions {\n        name\n        value\n      }\n      serviceOptions {\n        name\n        value\n      }\n    }\n  }\n": types.GetCategoryFormDocument,
    "\n  #graphql\n  query GetCategoryItem ($id: String!){\n    categoryItem (id: $id) {\n      id\n      name\n      parentId\n    }\n  }\n": types.GetCategoryItemDocument,
    "\n  #graphql\n  query GetCategoryItems(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    categoryItems(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        name\n      }\n      pageInfo {\n        endCursor\n        totalCount\n      }\n    }\n  }\n": types.GetCategoryItemsDocument,
    "\n  #graphql\n  query GetCategoryItemForm($id: String!) {\n    categoryItemForm(id: $id) {\n      name\n      ancestorIds\n      parentId\n      tag\n      tenantId\n    }\n  }\n": types.GetCategoryItemFormDocument,
    "#graphql\n  query GetCategoryItemTrees {\n    categoryItemTrees {\n      id\n      name\n      tag\n      ancestorIds\n      parentId\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n": types.GetCategoryItemTreesDocument,
    "\n  query GetGroup($id: String!){\n    group(id: $id) {\n      id\n    }\n  }\n": types.GetGroupDocument,
    "\n  #graphql\n  query GetGroups(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    groups(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n": types.GetGroupsDocument,
    "\n  query GetGroupForm($id: String!) {\n    groupForm(id: $id) {\n      name\n      tenantId\n      serviceId\n    }\n  }\n": types.GetGroupFormDocument,
    "\n  query GetRole($id: String!){\n    role(id: $id) {\n      id\n    }\n  }\n": types.GetRoleDocument,
    "\n  #graphql\n  query GetRoles(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    roles(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        name\n        deletedAt\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n": types.GetRolesDocument,
    "\n  query GetRoleForm($id: String!) {\n    roleForm(id: $id) {\n      name\n      options {\n        name\n        value\n      }\n    }\n  }\n": types.GetRoleFormDocument,
    "\n  query GetService($id: String!) {\n    service(id: $id) {\n      id\n      name\n    }\n  }\n": types.GetServiceDocument,
    "\n  #graphql\n  query GetServices(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    services(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n": types.GetServicesDocument,
    "\n  query GetServiceForm {\n    serviceForm {\n      name\n    }\n  }\n": types.GetServiceFormDocument,
    "\n  query GetSession($id: String!){\n    session(id: $id) {\n      id\n    }\n  }\n": types.GetSessionDocument,
    "\n  #graphql\n  query GetSessions(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    sessions(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n": types.GetSessionsDocument,
    "\n  query GetSessionForm($id: String!) {\n    sessionForm(id: $id) {\n      name\n      dates\n      tenantId\n    }\n  }\n": types.GetSessionFormDocument,
    "\n  query GetSpace($id: String!){\n    space(id: $id) {\n      id\n    }\n  }\n": types.GetSpaceDocument,
    "\n  #graphql\n  query GetSpaces(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    spaces(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        address\n        phone\n        updatedAt\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n": types.GetSpacesDocument,
    "\n  query GetSpaceForm($id: String!) {\n    spaceForm(id: $id) {\n      name\n      address\n      phone\n    }\n  }\n": types.GetSpaceFormDocument,
    "\n  query GetTimelineItem($id: String!){\n    timelineItem(id: $id) {\n      id\n    }\n  }\n": types.GetTimelineItemDocument,
    "\n  #graphql\n  query GetTimelineItems(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    timelineItems(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        title\n        createdAt\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n": types.GetTimelineItemsDocument,
    "\n  query GetTimelineItemForm($id: String!) {\n    timelineItemForm(id: $id) {\n      title\n      startDateTime\n      endDateTime\n      maxCapacity\n      minCapacity\n      description\n      address\n      timelineId\n    }\n  }\n": types.GetTimelineItemFormDocument,
    "\n  query GetTimeline($id: String!){\n    timeline(id: $id) {\n      date\n    }\n  }\n": types.GetTimelineDocument,
    "\n  #graphql\n  query GetTimelines(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    timelines(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        date\n        createdAt\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n": types.GetTimelinesDocument,
    "\n  query GetTimelineForm($timelineId: String!, $sessionId: String!) {\n    timelineForm(timelineId: $timelineId, sessionId: $sessionId) {\n      name\n      sessionId\n      date\n      session {\n        name\n        dates\n        tenantId\n      }\n      timelineItems {\n        id\n        title\n        startDateTime\n        endDateTime\n        maxCapacity\n        minCapacity\n        address\n        description\n      }\n    }\n  }\n": types.GetTimelineFormDocument,
    "\n  query GetUser($id: String!) {\n    user(id: $id) {\n      id\n      email\n      profiles {\n        nickname\n        phone\n      }\n    }\n  }\n": types.GetUserDocument,
    "#graphql\n  query GetUsers(\n    $email: String\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    users(\n      email: $email\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        email\n      }\n      pageInfo {\n        endCursor\n        totalCount\n      }\n    }\n  }\n": types.GetUsersDocument,
    "#graphql\n  query GetUserForm($id: String!){\n    userForm(id: $id) {\n      name\n      email\n      password\n      roleId\n      spaceId\n      roleOptions {\n        name\n        value\n      }\n      spaceOptions {\n        name\n        value\n      }\n    }\n  }\n": types.GetUserFormDocument,
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
export function gql(source: "\n  mutation CreateGroup($createGroupInput: CreateGroupInput!) {\n    createGroup(createGroupInput: $createGroupInput) {\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateGroup($createGroupInput: CreateGroupInput!) {\n    createGroup(createGroupInput: $createGroupInput) {\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteGroup($id: String!) {\n    deleteGroup(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteGroup($id: String!) {\n    deleteGroup(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateGroup($updateGroupInput: UpdateGroupInput!) {\n    updateGroup(updateGroupInput: $updateGroupInput) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateGroup($updateGroupInput: UpdateGroupInput!) {\n    updateGroup(updateGroupInput: $updateGroupInput) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateRole($createRoleInput: CreateRoleInput!) {\n    createRole(createRoleInput: $createRoleInput) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateRole($createRoleInput: CreateRoleInput!) {\n    createRole(createRoleInput: $createRoleInput) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteRole($id: String!) {\n    deleteRole(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteRole($id: String!) {\n    deleteRole(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveRole($id: String!) {\n    removeRole(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveRole($id: String!) {\n    removeRole(id: $id) {\n      id\n    }\n  }\n"];
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
export function gql(source: "\n  mutation CreateSession($createSessionInput: CreateSessionInput!) {\n    createSession(createSessionInput: $createSessionInput) {\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateSession($createSessionInput: CreateSessionInput!) {\n    createSession(createSessionInput: $createSessionInput) {\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteSession($id: String!) {\n    deleteSession(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteSession($id: String!) {\n    deleteSession(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateSession($updateSessionInput: UpdateSessionInput!) {\n    updateSession(updateSessionInput: $updateSessionInput) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateSession($updateSessionInput: UpdateSessionInput!) {\n    updateSession(updateSessionInput: $updateSessionInput) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateSpace($createSpaceInput: CreateSpaceInput!) {\n    createSpace(createSpaceInput: $createSpaceInput) {\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateSpace($createSpaceInput: CreateSpaceInput!) {\n    createSpace(createSpaceInput: $createSpaceInput) {\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteSpace($id: String!) {\n    deleteSpace(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteSpace($id: String!) {\n    deleteSpace(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateSpace($updateSpaceInput: UpdateSpaceInput!) {\n    updateSpace(updateSpaceInput: $updateSpaceInput) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateSpace($updateSpaceInput: UpdateSpaceInput!) {\n    updateSpace(updateSpaceInput: $updateSpaceInput) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateTimelineItem($createTimelineItemInput: CreateTimelineItemInput!) {\n    createTimelineItem(createTimelineItemInput: $createTimelineItemInput) {\n      description\n      title\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTimelineItem($createTimelineItemInput: CreateTimelineItemInput!) {\n    createTimelineItem(createTimelineItemInput: $createTimelineItemInput) {\n      description\n      title\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteTimelineItem($id: String!) {\n    deleteTimelineItem(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteTimelineItem($id: String!) {\n    deleteTimelineItem(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateTimelineItem($updateTimelineItemInput: UpdateTimelineItemInput!) {\n    updateTimelineItem(updateTimelineItemInput: $updateTimelineItemInput) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTimelineItem($updateTimelineItemInput: UpdateTimelineItemInput!) {\n    updateTimelineItem(updateTimelineItemInput: $updateTimelineItemInput) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateTimeline($createTimelineInput: CreateTimelineInput!) {\n    createTimeline(createTimelineInput: $createTimelineInput) {\n      date\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTimeline($createTimelineInput: CreateTimelineInput!) {\n    createTimeline(createTimelineInput: $createTimelineInput) {\n      date\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteTimeline($id: String!) {\n    deleteTimeline(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteTimeline($id: String!) {\n    deleteTimeline(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateTimeline($updateTimelineInput: UpdateTimelineInput!) {\n    updateTimeline(updateTimelineInput: $updateTimelineInput) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTimeline($updateTimelineInput: UpdateTimelineInput!) {\n    updateTimeline(updateTimelineInput: $updateTimelineInput) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateUser($createUserInput: CreateUserInput!) {\n    createUser(createUserInput: $createUserInput) {\n      id\n      name\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($createUserInput: CreateUserInput!) {\n    createUser(createUserInput: $createUserInput) {\n      id\n      name\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation UpdateUser ($updateUserInput: UpdateUserInput!) {\n    updateUser(updateUserInput: $updateUserInput){\n      email\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation UpdateUser ($updateUserInput: UpdateUserInput!) {\n    updateUser(updateUserInput: $updateUserInput){\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query GetCategories($take: Int, $skip: Int) {\n    categories (take: $take, skip: $skip) {\n      nodes {\n        id \n        name\n        deletedAt\n      }\n      pageInfo {\n        endCursor \n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetCategories($take: Int, $skip: Int) {\n    categories (take: $take, skip: $skip) {\n      nodes {\n        id \n        name\n        deletedAt\n      }\n      pageInfo {\n        endCursor \n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetCategory($id: String!) {\n    category(id: $id) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetCategory($id: String!) {\n    category(id: $id) {\n      id\n      name\n    }\n  }\n"];
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
export function gql(source: "\n  #graphql\n  query GetCategoryItemForm($id: String!) {\n    categoryItemForm(id: $id) {\n      name\n      ancestorIds\n      parentId\n      tag\n      tenantId\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetCategoryItemForm($id: String!) {\n    categoryItemForm(id: $id) {\n      name\n      ancestorIds\n      parentId\n      tag\n      tenantId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query GetCategoryItemTrees {\n    categoryItemTrees {\n      id\n      name\n      tag\n      ancestorIds\n      parentId\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetCategoryItemTrees {\n    categoryItemTrees {\n      id\n      name\n      tag\n      ancestorIds\n      parentId\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetGroup($id: String!){\n    group(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  query GetGroup($id: String!){\n    group(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetGroups(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    groups(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetGroups(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    groups(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetGroupForm($id: String!) {\n    groupForm(id: $id) {\n      name\n      tenantId\n      serviceId\n    }\n  }\n"): (typeof documents)["\n  query GetGroupForm($id: String!) {\n    groupForm(id: $id) {\n      name\n      tenantId\n      serviceId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetRole($id: String!){\n    role(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  query GetRole($id: String!){\n    role(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetRoles(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    roles(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        name\n        deletedAt\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetRoles(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    roles(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        name\n        deletedAt\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetRoleForm($id: String!) {\n    roleForm(id: $id) {\n      name\n      options {\n        name\n        value\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetRoleForm($id: String!) {\n    roleForm(id: $id) {\n      name\n      options {\n        name\n        value\n      }\n    }\n  }\n"];
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
export function gql(source: "\n  query GetSession($id: String!){\n    session(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  query GetSession($id: String!){\n    session(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetSessions(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    sessions(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetSessions(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    sessions(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSessionForm($id: String!) {\n    sessionForm(id: $id) {\n      name\n      dates\n      tenantId\n    }\n  }\n"): (typeof documents)["\n  query GetSessionForm($id: String!) {\n    sessionForm(id: $id) {\n      name\n      dates\n      tenantId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSpace($id: String!){\n    space(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  query GetSpace($id: String!){\n    space(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetSpaces(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    spaces(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        address\n        phone\n        updatedAt\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetSpaces(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    spaces(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        address\n        phone\n        updatedAt\n        createdAt\n        name\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSpaceForm($id: String!) {\n    spaceForm(id: $id) {\n      name\n      address\n      phone\n    }\n  }\n"): (typeof documents)["\n  query GetSpaceForm($id: String!) {\n    spaceForm(id: $id) {\n      name\n      address\n      phone\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTimelineItem($id: String!){\n    timelineItem(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  query GetTimelineItem($id: String!){\n    timelineItem(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetTimelineItems(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    timelineItems(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        title\n        createdAt\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetTimelineItems(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    timelineItems(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        title\n        createdAt\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTimelineItemForm($id: String!) {\n    timelineItemForm(id: $id) {\n      title\n      startDateTime\n      endDateTime\n      maxCapacity\n      minCapacity\n      description\n      address\n      timelineId\n    }\n  }\n"): (typeof documents)["\n  query GetTimelineItemForm($id: String!) {\n    timelineItemForm(id: $id) {\n      title\n      startDateTime\n      endDateTime\n      maxCapacity\n      minCapacity\n      description\n      address\n      timelineId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTimeline($id: String!){\n    timeline(id: $id) {\n      date\n    }\n  }\n"): (typeof documents)["\n  query GetTimeline($id: String!){\n    timeline(id: $id) {\n      date\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetTimelines(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    timelines(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        date\n        createdAt\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetTimelines(\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    timelines(\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        date\n        createdAt\n      }\n      pageInfo {\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTimelineForm($timelineId: String!, $sessionId: String!) {\n    timelineForm(timelineId: $timelineId, sessionId: $sessionId) {\n      name\n      sessionId\n      date\n      session {\n        name\n        dates\n        tenantId\n      }\n      timelineItems {\n        id\n        title\n        startDateTime\n        endDateTime\n        maxCapacity\n        minCapacity\n        address\n        description\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetTimelineForm($timelineId: String!, $sessionId: String!) {\n    timelineForm(timelineId: $timelineId, sessionId: $sessionId) {\n      name\n      sessionId\n      date\n      session {\n        name\n        dates\n        tenantId\n      }\n      timelineItems {\n        id\n        title\n        startDateTime\n        endDateTime\n        maxCapacity\n        minCapacity\n        address\n        description\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUser($id: String!) {\n    user(id: $id) {\n      id\n      email\n      profiles {\n        nickname\n        phone\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUser($id: String!) {\n    user(id: $id) {\n      id\n      email\n      profiles {\n        nickname\n        phone\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query GetUsers(\n    $email: String\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    users(\n      email: $email\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        email\n      }\n      pageInfo {\n        endCursor\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetUsers(\n    $email: String\n    $skip: Int\n    $take: Int\n    $sortingKey: String\n    $sortingValue: String\n  ) {\n    users(\n      email: $email\n      skip: $skip\n      take: $take\n      sortingKey: $sortingKey\n      sortingValue: $sortingValue\n    ) {\n      nodes {\n        id\n        email\n      }\n      pageInfo {\n        endCursor\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query GetUserForm($id: String!){\n    userForm(id: $id) {\n      name\n      email\n      password\n      roleId\n      spaceId\n      roleOptions {\n        name\n        value\n      }\n      spaceOptions {\n        name\n        value\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetUserForm($id: String!){\n    userForm(id: $id) {\n      name\n      email\n      password\n      roleId\n      spaceId\n      roleOptions {\n        name\n        value\n      }\n      spaceOptions {\n        name\n        value\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any };
  /** A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction. */
  JWT: { input: any; output: any };
};

export type Auth = {
  __typename?: 'Auth';
  /** JWT access token */
  accessToken: Scalars['JWT']['output'];
  /** JWT refresh token */
  refreshToken: Scalars['JWT']['output'];
  user: User;
};

export type Category = {
  __typename?: 'Category';
  categoryItem: CategoryItem;
  categoryItemId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  service: Service;
  serviceId: Scalars['String']['output'];
  tenantId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CategoryEdge = {
  __typename?: 'CategoryEdge';
  cursor: Scalars['String']['output'];
  node: Category;
};

export type CategoryForm = {
  __typename?: 'CategoryForm';
  itemId: Scalars['String']['output'];
  itemOptions: Array<Option>;
  name: Scalars['String']['output'];
  serviceId: Scalars['String']['output'];
  serviceOptions: Array<Option>;
};

export type CategoryItem = {
  __typename?: 'CategoryItem';
  ancestorIds: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  parentId?: Maybe<Scalars['String']['output']>;
  tag: Scalars['String']['output'];
  tenantId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CategoryItemEdge = {
  __typename?: 'CategoryItemEdge';
  cursor: Scalars['String']['output'];
  node: CategoryItem;
};

export type CategoryItemForm = {
  __typename?: 'CategoryItemForm';
  ancestorIds: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  parentId?: Maybe<Scalars['String']['output']>;
  tag: Scalars['String']['output'];
  tenantId: Scalars['String']['output'];
};

export type CategoryItemPageInfo = {
  __typename?: 'CategoryItemPageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type CategoryPageInfo = {
  __typename?: 'CategoryPageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type CreateCategoryInput = {
  categoryItemId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
  tenantId: Scalars['String']['input'];
};

export type CreateCategoryItemInput = {
  ancestorIds?: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
  tag: Scalars['String']['input'];
  tenantId: Scalars['String']['input'];
};

export type CreateGroupInput = {
  name: Scalars['String']['input'];
  serviceId: Scalars['String']['input'];
  tenantId: Scalars['String']['input'];
};

export type CreateReservationInput = {
  status: Scalars['String']['input'];
  timelineItemId: Scalars['String']['input'];
};

export type CreateRoleInput = {
  name?: InputMaybe<RoleEnum>;
};

export type CreateServiceInput = {
  name: Scalars['String']['input'];
};

export type CreateSessionInput = {
  dates: Array<Scalars['DateTime']['input']>;
  name: Scalars['String']['input'];
  tenantId: Scalars['String']['input'];
};

export type CreateSpaceInput = {
  address: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type CreateTenantInput = {
  roleId: Scalars['String']['input'];
  spaceId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type CreateTimelineInput = {
  date: Scalars['DateTime']['input'];
  sessionId: Scalars['String']['input'];
};

export type CreateTimelineItemInput = {
  address: Scalars['String']['input'];
  description: Scalars['String']['input'];
  timelineId: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  nickname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  roleId?: InputMaybe<Scalars['String']['input']>;
  spaceId?: InputMaybe<Scalars['String']['input']>;
};

export type Group = {
  __typename?: 'Group';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  serviceId: Scalars['String']['output'];
  tenantId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type GroupEdge = {
  __typename?: 'GroupEdge';
  cursor: Scalars['String']['output'];
  node: Group;
};

export type GroupForm = {
  __typename?: 'GroupForm';
  name: Scalars['String']['output'];
  serviceId: Scalars['String']['output'];
  tenantId: Scalars['String']['output'];
};

export type GroupPageInfo = {
  __typename?: 'GroupPageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: Category;
  createCategoryItem: CategoryItem;
  createGroup: Group;
  createReservation: Reservation;
  createRole: Role;
  createService: Service;
  createSession: Session;
  createSpace: Space;
  createTenant: Tenant;
  createTimeline: Timeline;
  createTimelineItem: TimelineItem;
  createUser: User;
  deleteCategories: Category;
  deleteCategoryItem: CategoryItem;
  deleteGroup: Group;
  deleteReservation: Reservation;
  deleteRole: Role;
  deleteService: Service;
  deleteSession: Session;
  deleteSpace: Space;
  deleteTenant: Tenant;
  deleteTimeline: Timeline;
  deleteTimelineItem: TimelineItem;
  login: Auth;
  refreshToken: Token;
  removeCategory: Category;
  removeProfile: Profile;
  removeRole: Role;
  signup: Auth;
  updateCategory: Category;
  updateCategoryItem: CategoryItem;
  updateGroup: Group;
  updateProfile: Profile;
  updateReservation: Reservation;
  updateRole: Role;
  updateService: Service;
  updateSession: Session;
  updateSpace: Space;
  updateTenant: Tenant;
  updateTimeline: Timeline;
  updateTimelineItem: TimelineItem;
  updateUser: User;
};

export type MutationCreateCategoryArgs = {
  createCategoryInput: CreateCategoryInput;
};

export type MutationCreateCategoryItemArgs = {
  createCategoryItemInput: CreateCategoryItemInput;
};

export type MutationCreateGroupArgs = {
  createGroupInput: CreateGroupInput;
};

export type MutationCreateReservationArgs = {
  createReservationInput: CreateReservationInput;
};

export type MutationCreateRoleArgs = {
  createRoleInput: CreateRoleInput;
};

export type MutationCreateServiceArgs = {
  createServiceInput: CreateServiceInput;
};

export type MutationCreateSessionArgs = {
  createSessionInput: CreateSessionInput;
};

export type MutationCreateSpaceArgs = {
  createSpaceInput: CreateSpaceInput;
};

export type MutationCreateTenantArgs = {
  createTenantInput: CreateTenantInput;
};

export type MutationCreateTimelineArgs = {
  createTimelineInput: CreateTimelineInput;
};

export type MutationCreateTimelineItemArgs = {
  createTimelineItemInput: CreateTimelineItemInput;
};

export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};

export type MutationDeleteCategoriesArgs = {
  ids: Array<Scalars['String']['input']>;
};

export type MutationDeleteCategoryItemArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeleteGroupArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeleteReservationArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeleteRoleArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeleteServiceArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeleteSessionArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeleteSpaceArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeleteTenantArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeleteTimelineArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeleteTimelineItemArgs = {
  id: Scalars['String']['input'];
};

export type MutationLoginArgs = {
  data: LoginInput;
};

export type MutationRefreshTokenArgs = {
  token: Scalars['JWT']['input'];
};

export type MutationRemoveCategoryArgs = {
  id: Scalars['String']['input'];
};

export type MutationRemoveProfileArgs = {
  id: Scalars['String']['input'];
};

export type MutationRemoveRoleArgs = {
  id: Scalars['String']['input'];
};

export type MutationSignupArgs = {
  data: SignupInput;
};

export type MutationUpdateCategoryArgs = {
  updateCategoryInput: UpdateCategoryInput;
};

export type MutationUpdateCategoryItemArgs = {
  updateCategoryItemInput: UpdateCategoryItemInput;
};

export type MutationUpdateGroupArgs = {
  updateGroupInput: UpdateGroupInput;
};

export type MutationUpdateProfileArgs = {
  updateProfileInput: UpdateProfileInput;
};

export type MutationUpdateReservationArgs = {
  updateReservationInput: UpdateReservationInput;
};

export type MutationUpdateRoleArgs = {
  updateRoleInput: UpdateRoleInput;
};

export type MutationUpdateServiceArgs = {
  updateServiceInput: UpdateServiceInput;
};

export type MutationUpdateSessionArgs = {
  updateSessionInput: UpdateSessionInput;
};

export type MutationUpdateSpaceArgs = {
  updateSpaceInput: UpdateSpaceInput;
};

export type MutationUpdateTenantArgs = {
  updateTenantInput: UpdateTenantInput;
};

export type MutationUpdateTimelineArgs = {
  updateTimelineInput: UpdateTimelineInput;
};

export type MutationUpdateTimelineItemArgs = {
  updateTimelineItemInput: UpdateTimelineItemInput;
};

export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type Option = {
  __typename?: 'Option';
  name: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type OptionInput = {
  name: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type PaginatedCategory = {
  __typename?: 'PaginatedCategory';
  edges: Array<CategoryEdge>;
  nodes: Array<Category>;
  pageInfo: CategoryPageInfo;
};

export type PaginatedCategoryItem = {
  __typename?: 'PaginatedCategoryItem';
  edges: Array<CategoryItemEdge>;
  nodes: Array<CategoryItem>;
  pageInfo: CategoryItemPageInfo;
};

export type PaginatedGroup = {
  __typename?: 'PaginatedGroup';
  edges: Array<GroupEdge>;
  nodes: Array<Group>;
  pageInfo: GroupPageInfo;
};

export type PaginatedReservation = {
  __typename?: 'PaginatedReservation';
  edges: Array<ReservationEdge>;
  nodes: Array<Reservation>;
  pageInfo: ReservationPageInfo;
};

export type PaginatedRole = {
  __typename?: 'PaginatedRole';
  edges: Array<RoleEdge>;
  nodes: Array<Role>;
  pageInfo: RolePageInfo;
};

export type PaginatedService = {
  __typename?: 'PaginatedService';
  edges: Array<ServiceEdge>;
  nodes: Array<Service>;
  pageInfo: ServicePageInfo;
};

export type PaginatedSession = {
  __typename?: 'PaginatedSession';
  edges: Array<SessionEdge>;
  nodes: Array<Session>;
  pageInfo: SessionPageInfo;
};

export type PaginatedSpace = {
  __typename?: 'PaginatedSpace';
  edges: Array<SpaceEdge>;
  nodes: Array<Space>;
  pageInfo: SpacePageInfo;
};

export type PaginatedTenant = {
  __typename?: 'PaginatedTenant';
  edges: Array<TenantEdge>;
  nodes: Array<Tenant>;
  pageInfo: TenantPageInfo;
};

export type PaginatedTimeline = {
  __typename?: 'PaginatedTimeline';
  edges: Array<TimelineEdge>;
  nodes: Array<Timeline>;
  pageInfo: TimelinePageInfo;
};

export type PaginatedTimelineItem = {
  __typename?: 'PaginatedTimelineItem';
  edges: Array<TimelineItemEdge>;
  nodes: Array<TimelineItem>;
  pageInfo: TimelineItemPageInfo;
};

export type PaginatedUser = {
  __typename?: 'PaginatedUser';
  edges: Array<UserEdge>;
  nodes: Array<User>;
  pageInfo: UserPageInfo;
};

export type Profile = {
  __typename?: 'Profile';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  nickname: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userId: Scalars['String']['output'];
};

export type ProfileInput = {
  nickname: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type ProfileInputType = {
  nickname: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  categories: PaginatedCategory;
  category: Category;
  categoryForm: CategoryForm;
  categoryItem: CategoryItem;
  categoryItemForm: CategoryItemForm;
  categoryItemTrees: Array<CategoryItem>;
  categoryItems: PaginatedCategoryItem;
  group: Group;
  groupForm: GroupForm;
  groups: PaginatedGroup;
  profile: Profile;
  reservation: Reservation;
  reservationForm: ReservationForm;
  reservations: PaginatedReservation;
  role: Role;
  roleForm: RoleForm;
  roles: PaginatedRole;
  service: Service;
  serviceForm: ServiceForm;
  services: PaginatedService;
  session: Session;
  sessionForm: SessionForm;
  sessions: PaginatedSession;
  space: Space;
  spaceForm: SpaceForm;
  spaces: PaginatedSpace;
  tenant: Tenant;
  tenantForm: TenantForm;
  tenants: PaginatedTenant;
  timeline: Timeline;
  timelineForm: TimelineForm;
  timeline_item: TimelineItem;
  timeline_itemForm: TimelineItemForm;
  timeline_items: PaginatedTimelineItem;
  timelines: PaginatedTimeline;
  user: User;
  userForm: UserForm;
  users: PaginatedUser;
};

export type QueryCategoriesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryCategoryArgs = {
  id: Scalars['String']['input'];
};

export type QueryCategoryFormArgs = {
  id: Scalars['String']['input'];
};

export type QueryCategoryItemArgs = {
  id: Scalars['String']['input'];
};

export type QueryCategoryItemFormArgs = {
  id: Scalars['String']['input'];
};

export type QueryCategoryItemsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryGroupArgs = {
  id: Scalars['String']['input'];
};

export type QueryGroupFormArgs = {
  id: Scalars['String']['input'];
};

export type QueryGroupsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  endTimestamp?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
  startTimestamp?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryProfileArgs = {
  id: Scalars['ID']['input'];
};

export type QueryReservationArgs = {
  id: Scalars['String']['input'];
};

export type QueryReservationsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  endTimestamp?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
  startTimestamp?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryRoleArgs = {
  id: Scalars['String']['input'];
};

export type QueryRoleFormArgs = {
  id: Scalars['String']['input'];
};

export type QueryRolesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  endTimestamp?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
  startTimestamp?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryServiceArgs = {
  id: Scalars['String']['input'];
};

export type QueryServicesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  endTimestamp?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
  startTimestamp?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type QuerySessionArgs = {
  id: Scalars['String']['input'];
};

export type QuerySessionFormArgs = {
  id: Scalars['String']['input'];
};

export type QuerySessionsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  endTimestamp?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
  startTimestamp?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type QuerySpaceArgs = {
  id: Scalars['String']['input'];
};

export type QuerySpaceFormArgs = {
  id: Scalars['String']['input'];
};

export type QuerySpacesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  endTimestamp?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
  startTimestamp?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTenantArgs = {
  id: Scalars['String']['input'];
};

export type QueryTenantsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  endTimestamp?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
  startTimestamp?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTimelineArgs = {
  id: Scalars['String']['input'];
};

export type QueryTimelineFormArgs = {
  sessionId: Scalars['String']['input'];
  timelineId: Scalars['String']['input'];
};

export type QueryTimeline_ItemArgs = {
  id: Scalars['String']['input'];
};

export type QueryTimeline_ItemsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  endTimestamp?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
  startTimestamp?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTimelinesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  endTimestamp?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
  startTimestamp?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryUserArgs = {
  id: Scalars['String']['input'];
};

export type QueryUserFormArgs = {
  id: Scalars['String']['input'];
};

export type QueryUsersArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type Reservation = {
  __typename?: 'Reservation';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  status: Scalars['String']['output'];
  timelineItemId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ReservationEdge = {
  __typename?: 'ReservationEdge';
  cursor: Scalars['String']['output'];
  node: Reservation;
};

export type ReservationForm = {
  __typename?: 'ReservationForm';
  status: Scalars['String']['output'];
  timelineItemId: Scalars['String']['output'];
};

export type ReservationPageInfo = {
  __typename?: 'ReservationPageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  name: RoleEnum;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type RoleEdge = {
  __typename?: 'RoleEdge';
  cursor: Scalars['String']['output'];
  node: Role;
};

export enum RoleEnum {
  SuperAdmin = 'SUPER_ADMIN',
  User = 'USER',
}

export type RoleForm = {
  __typename?: 'RoleForm';
  name?: Maybe<RoleEnum>;
  options: Array<Option>;
};

export type RoleInput = {
  name: RoleEnum;
};

export type RolePageInfo = {
  __typename?: 'RolePageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type Service = {
  __typename?: 'Service';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ServiceEdge = {
  __typename?: 'ServiceEdge';
  cursor: Scalars['String']['output'];
  node: Service;
};

export type ServiceForm = {
  __typename?: 'ServiceForm';
  name?: Maybe<Scalars['String']['output']>;
};

export type ServicePageInfo = {
  __typename?: 'ServicePageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type Session = {
  __typename?: 'Session';
  createdAt: Scalars['DateTime']['output'];
  dates: Array<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  tenantId: Scalars['String']['output'];
  tilelines?: Maybe<Array<Timeline>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type SessionEdge = {
  __typename?: 'SessionEdge';
  cursor: Scalars['String']['output'];
  node: Session;
};

export type SessionForm = {
  __typename?: 'SessionForm';
  dates: Array<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  tenantId: Scalars['String']['output'];
};

export type SessionInputType = {
  dates: Array<Scalars['DateTime']['input']>;
  name: Scalars['String']['input'];
  tenantId: Scalars['String']['input'];
  tilelines?: InputMaybe<Array<TimelineInputType>>;
};

export type SessionPageInfo = {
  __typename?: 'SessionPageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type SignupInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  profile: ProfileInput;
};

export type Space = {
  __typename?: 'Space';
  address: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type SpaceEdge = {
  __typename?: 'SpaceEdge';
  cursor: Scalars['String']['output'];
  node: Space;
};

export type SpaceForm = {
  __typename?: 'SpaceForm';
  address: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
};

export type SpaceInput = {
  address: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type SpacePageInfo = {
  __typename?: 'SpacePageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type Tenant = {
  __typename?: 'Tenant';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  role?: Maybe<Role>;
  roleId: Scalars['String']['output'];
  space?: Maybe<Space>;
  spaceId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
};

export type TenantEdge = {
  __typename?: 'TenantEdge';
  cursor: Scalars['String']['output'];
  node: Tenant;
};

export type TenantForm = {
  __typename?: 'TenantForm';
  roleId?: Maybe<Scalars['String']['output']>;
  spaceId?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type TenantInputType = {
  role?: InputMaybe<RoleInput>;
  roleId: Scalars['String']['input'];
  space?: InputMaybe<SpaceInput>;
  spaceId: Scalars['String']['input'];
  user?: InputMaybe<UserInputType>;
  userId: Scalars['String']['input'];
};

export type TenantPageInfo = {
  __typename?: 'TenantPageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type Timeline = {
  __typename?: 'Timeline';
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  sessionId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TimelineEdge = {
  __typename?: 'TimelineEdge';
  cursor: Scalars['String']['output'];
  node: Timeline;
};

export type TimelineForm = {
  __typename?: 'TimelineForm';
  date?: Maybe<Scalars['DateTime']['output']>;
  session: Session;
  sessionId: Scalars['String']['output'];
};

export type TimelineInputType = {
  date: Scalars['DateTime']['input'];
  sessionId: Scalars['String']['input'];
};

export type TimelineItem = {
  __typename?: 'TimelineItem';
  address: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  timelineId: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TimelineItemEdge = {
  __typename?: 'TimelineItemEdge';
  cursor: Scalars['String']['output'];
  node: TimelineItem;
};

export type TimelineItemForm = {
  __typename?: 'TimelineItemForm';
  address: Scalars['String']['output'];
  description: Scalars['String']['output'];
  timelineId: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type TimelineItemPageInfo = {
  __typename?: 'TimelineItemPageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type TimelinePageInfo = {
  __typename?: 'TimelinePageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type Token = {
  __typename?: 'Token';
  /** JWT access token */
  accessToken: Scalars['JWT']['output'];
  /** JWT refresh token */
  refreshToken: Scalars['JWT']['output'];
};

export type UpdateCategoryInput = {
  categoryItemId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  serviceId?: InputMaybe<Scalars['String']['input']>;
  tenantId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryItemInput = {
  ancestorIds?: InputMaybe<Array<Scalars['String']['input']>>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['String']['input']>;
  tag?: InputMaybe<Scalars['String']['input']>;
  tenantId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGroupInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  serviceId?: InputMaybe<Scalars['String']['input']>;
  tenantId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProfileInput = {
  id: Scalars['ID']['input'];
  nickname?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReservationInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  timelineItemId?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateRoleInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<RoleEnum>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateServiceInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateSessionInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  dates?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  tenantId?: InputMaybe<Scalars['String']['input']>;
  tilelines?: InputMaybe<Array<TimelineInputType>>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateSpaceInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTenantInput = {
  id: Scalars['ID']['input'];
  roleId?: InputMaybe<Scalars['String']['input']>;
  spaceId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTimelineInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateTimelineItemInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  timelineId?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  roleId?: InputMaybe<Scalars['String']['input']>;
  spaceId?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  profiles: Array<Profile>;
  tenants: Array<Tenant>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  node: User;
};

export type UserForm = {
  __typename?: 'UserForm';
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  nickname: Scalars['String']['output'];
  password: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  roleId?: Maybe<Scalars['String']['output']>;
  roleOptions: Array<Option>;
  spaceId?: Maybe<Scalars['String']['output']>;
  spaceOptions: Array<Option>;
};

export type UserInputType = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  profiles: Array<ProfileInputType>;
  tenants: Array<TenantInputType>;
};

export type UserPageInfo = {
  __typename?: 'UserPageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type LoginMutationVariables = Exact<{
  data: LoginInput;
}>;

export type LoginMutation = {
  __typename?: 'Mutation';
  login: { __typename?: 'Auth'; accessToken: any; refreshToken: any };
};

export type SignUpMutationVariables = Exact<{
  signUpInput: SignupInput;
}>;

export type SignUpMutation = {
  __typename?: 'Mutation';
  signup: {
    __typename?: 'Auth';
    user: { __typename?: 'User'; id: string; email: string };
  };
};

export type CreateCategoryMutationVariables = Exact<{
  createCategoryInput: CreateCategoryInput;
}>;

export type CreateCategoryMutation = {
  __typename?: 'Mutation';
  createCategory: { __typename?: 'Category'; id: string };
};

export type DeleteCategoriesMutationVariables = Exact<{
  ids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;

export type DeleteCategoriesMutation = {
  __typename?: 'Mutation';
  deleteCategories: { __typename?: 'Category'; name: string };
};

export type RemoveCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type RemoveCategoryMutation = {
  __typename?: 'Mutation';
  removeCategory: { __typename?: 'Category'; id: string };
};

export type UpdateCategoryMutationVariables = Exact<{
  updateCategoryInput: UpdateCategoryInput;
}>;

export type UpdateCategoryMutation = {
  __typename?: 'Mutation';
  updateCategory: { __typename?: 'Category'; id: string };
};

export type CreateCategoryItemMutationVariables = Exact<{
  createCategoryItemInput: CreateCategoryItemInput;
}>;

export type CreateCategoryItemMutation = {
  __typename?: 'Mutation';
  createCategoryItem: {
    __typename?: 'CategoryItem';
    id: string;
    name: string;
    parentId?: string | null;
  };
};

export type DeleteCategoryItemMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteCategoryItemMutation = {
  __typename?: 'Mutation';
  deleteCategoryItem: {
    __typename?: 'CategoryItem';
    id: string;
    name: string;
    deletedAt?: any | null;
  };
};

export type UpdateCategoryItemMutationVariables = Exact<{
  updateCategoryItemInput: UpdateCategoryItemInput;
}>;

export type UpdateCategoryItemMutation = {
  __typename?: 'Mutation';
  updateCategoryItem: {
    __typename?: 'CategoryItem';
    id: string;
    name: string;
    deletedAt?: any | null;
  };
};

export type CreateGroupMutationVariables = Exact<{
  createGroupInput: CreateGroupInput;
}>;

export type CreateGroupMutation = {
  __typename?: 'Mutation';
  createGroup: { __typename?: 'Group'; name: string };
};

export type DeleteGroupMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteGroupMutation = {
  __typename?: 'Mutation';
  deleteGroup: { __typename?: 'Group'; id: string };
};

export type UpdateGroupMutationVariables = Exact<{
  updateGroupInput: UpdateGroupInput;
}>;

export type UpdateGroupMutation = {
  __typename?: 'Mutation';
  updateGroup: { __typename?: 'Group'; id: string };
};

export type CreateRoleMutationVariables = Exact<{
  createRoleInput: CreateRoleInput;
}>;

export type CreateRoleMutation = {
  __typename?: 'Mutation';
  createRole: { __typename?: 'Role'; id: string };
};

export type DeleteRoleMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteRoleMutation = {
  __typename?: 'Mutation';
  deleteRole: { __typename?: 'Role'; id: string };
};

export type RemoveRoleMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type RemoveRoleMutation = {
  __typename?: 'Mutation';
  removeRole: { __typename?: 'Role'; id: string };
};

export type UpdateRoleMutationVariables = Exact<{
  updateRoleInput: UpdateRoleInput;
}>;

export type UpdateRoleMutation = {
  __typename?: 'Mutation';
  updateRole: { __typename?: 'Role'; id: string };
};

export type CreateServiceMutationVariables = Exact<{
  createServiceInput: CreateServiceInput;
}>;

export type CreateServiceMutation = {
  __typename?: 'Mutation';
  createService: { __typename?: 'Service'; id: string; name: string };
};

export type DeleteServiceMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteServiceMutation = {
  __typename?: 'Mutation';
  deleteService: { __typename?: 'Service'; id: string };
};

export type UpdateServiceMutationVariables = Exact<{
  updateServiceInput: UpdateServiceInput;
}>;

export type UpdateServiceMutation = {
  __typename?: 'Mutation';
  updateService: { __typename?: 'Service'; id: string; name: string };
};

export type CreateSessionMutationVariables = Exact<{
  createSessionInput: CreateSessionInput;
}>;

export type CreateSessionMutation = {
  __typename?: 'Mutation';
  createSession: { __typename?: 'Session'; name: string };
};

export type DeleteSessionMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteSessionMutation = {
  __typename?: 'Mutation';
  deleteSession: { __typename?: 'Session'; id: string };
};

export type UpdateSessionMutationVariables = Exact<{
  updateSessionInput: UpdateSessionInput;
}>;

export type UpdateSessionMutation = {
  __typename?: 'Mutation';
  updateSession: { __typename?: 'Session'; id: string };
};

export type CreateSpaceMutationVariables = Exact<{
  createSpaceInput: CreateSpaceInput;
}>;

export type CreateSpaceMutation = {
  __typename?: 'Mutation';
  createSpace: { __typename?: 'Space'; name: string };
};

export type DeleteSpaceMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteSpaceMutation = {
  __typename?: 'Mutation';
  deleteSpace: { __typename?: 'Space'; id: string };
};

export type UpdateSpaceMutationVariables = Exact<{
  updateSpaceInput: UpdateSpaceInput;
}>;

export type UpdateSpaceMutation = {
  __typename?: 'Mutation';
  updateSpace: { __typename?: 'Space'; id: string };
};

export type CreateTimelineMutationVariables = Exact<{
  createTimelineInput: CreateTimelineInput;
}>;

export type CreateTimelineMutation = {
  __typename?: 'Mutation';
  createTimeline: { __typename?: 'Timeline'; date: any };
};

export type DeleteTimelineMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteTimelineMutation = {
  __typename?: 'Mutation';
  deleteTimeline: { __typename?: 'Timeline'; id: string };
};

export type UpdateTimelineMutationVariables = Exact<{
  updateTimelineInput: UpdateTimelineInput;
}>;

export type UpdateTimelineMutation = {
  __typename?: 'Mutation';
  updateTimeline: { __typename?: 'Timeline'; id: string };
};

export type CreateUserMutationVariables = Exact<{
  createUserInput: CreateUserInput;
}>;

export type CreateUserMutation = {
  __typename?: 'Mutation';
  createUser: { __typename?: 'User'; id: string; name: string; email: string };
};

export type UpdateUserMutationVariables = Exact<{
  updateUserInput: UpdateUserInput;
}>;

export type UpdateUserMutation = {
  __typename?: 'Mutation';
  updateUser: { __typename?: 'User'; email: string };
};

export type GetCategoriesQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetCategoriesQuery = {
  __typename?: 'Query';
  categories: {
    __typename?: 'PaginatedCategory';
    nodes: Array<{
      __typename?: 'Category';
      id: string;
      name: string;
      deletedAt?: any | null;
    }>;
    pageInfo: {
      __typename?: 'CategoryPageInfo';
      endCursor?: string | null;
      totalCount: number;
    };
  };
};

export type GetCategoryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetCategoryQuery = {
  __typename?: 'Query';
  category: { __typename?: 'Category'; id: string; name: string };
};

export type GetCategoryFormQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetCategoryFormQuery = {
  __typename?: 'Query';
  categoryForm: {
    __typename?: 'CategoryForm';
    name: string;
    itemId: string;
    serviceId: string;
    itemOptions: Array<{ __typename?: 'Option'; name: string; value: string }>;
    serviceOptions: Array<{
      __typename?: 'Option';
      name: string;
      value: string;
    }>;
  };
};

export type GetCategoryItemQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetCategoryItemQuery = {
  __typename?: 'Query';
  categoryItem: {
    __typename?: 'CategoryItem';
    id: string;
    name: string;
    parentId?: string | null;
  };
};

export type GetCategoryItemsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetCategoryItemsQuery = {
  __typename?: 'Query';
  categoryItems: {
    __typename?: 'PaginatedCategoryItem';
    nodes: Array<{ __typename?: 'CategoryItem'; name: string }>;
    pageInfo: {
      __typename?: 'CategoryItemPageInfo';
      endCursor?: string | null;
      totalCount: number;
    };
  };
};

export type GetCategoryItemFormQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetCategoryItemFormQuery = {
  __typename?: 'Query';
  categoryItemForm: {
    __typename?: 'CategoryItemForm';
    name: string;
    ancestorIds: Array<string>;
    parentId?: string | null;
    tag: string;
    tenantId: string;
  };
};

export type GetCategoryItemTreesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetCategoryItemTreesQuery = {
  __typename?: 'Query';
  categoryItemTrees: Array<{
    __typename?: 'CategoryItem';
    id: string;
    name: string;
    tag: string;
    ancestorIds: Array<string>;
    parentId?: string | null;
    createdAt: any;
    updatedAt?: any | null;
    deletedAt?: any | null;
  }>;
};

export type GetGroupQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetGroupQuery = {
  __typename?: 'Query';
  group: { __typename?: 'Group'; id: string };
};

export type GetGroupsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetGroupsQuery = {
  __typename?: 'Query';
  groups: {
    __typename?: 'PaginatedGroup';
    nodes: Array<{
      __typename?: 'Group';
      id: string;
      createdAt: any;
      name: string;
    }>;
    pageInfo: { __typename?: 'GroupPageInfo'; totalCount: number };
  };
};

export type GetGroupFormQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetGroupFormQuery = {
  __typename?: 'Query';
  groupForm: {
    __typename?: 'GroupForm';
    name: string;
    tenantId: string;
    serviceId: string;
  };
};

export type GetRoleQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetRoleQuery = {
  __typename?: 'Query';
  role: { __typename?: 'Role'; id: string };
};

export type GetRolesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetRolesQuery = {
  __typename?: 'Query';
  roles: {
    __typename?: 'PaginatedRole';
    nodes: Array<{
      __typename?: 'Role';
      id: string;
      name: RoleEnum;
      deletedAt?: any | null;
    }>;
    pageInfo: { __typename?: 'RolePageInfo'; totalCount: number };
  };
};

export type GetRoleFormQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetRoleFormQuery = {
  __typename?: 'Query';
  roleForm: {
    __typename?: 'RoleForm';
    name?: RoleEnum | null;
    options: Array<{ __typename?: 'Option'; name: string; value: string }>;
  };
};

export type GetServiceQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetServiceQuery = {
  __typename?: 'Query';
  service: { __typename?: 'Service'; id: string; name: string };
};

export type GetServicesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetServicesQuery = {
  __typename?: 'Query';
  services: {
    __typename?: 'PaginatedService';
    nodes: Array<{
      __typename?: 'Service';
      id: string;
      createdAt: any;
      name: string;
    }>;
    pageInfo: { __typename?: 'ServicePageInfo'; totalCount: number };
  };
};

export type GetServiceFormQueryVariables = Exact<{ [key: string]: never }>;

export type GetServiceFormQuery = {
  __typename?: 'Query';
  serviceForm: { __typename?: 'ServiceForm'; name?: string | null };
};

export type GetSessionQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetSessionQuery = {
  __typename?: 'Query';
  session: { __typename?: 'Session'; id: string };
};

export type GetSessionsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetSessionsQuery = {
  __typename?: 'Query';
  sessions: {
    __typename?: 'PaginatedSession';
    nodes: Array<{
      __typename?: 'Session';
      id: string;
      createdAt: any;
      name: string;
    }>;
    pageInfo: { __typename?: 'SessionPageInfo'; totalCount: number };
  };
};

export type GetSessionFormQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetSessionFormQuery = {
  __typename?: 'Query';
  sessionForm: {
    __typename?: 'SessionForm';
    name: string;
    dates: Array<any>;
    tenantId: string;
  };
};

export type GetSpaceQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetSpaceQuery = {
  __typename?: 'Query';
  space: { __typename?: 'Space'; id: string };
};

export type GetSpacesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetSpacesQuery = {
  __typename?: 'Query';
  spaces: {
    __typename?: 'PaginatedSpace';
    nodes: Array<{
      __typename?: 'Space';
      id: string;
      address: string;
      phone: string;
      updatedAt?: any | null;
      createdAt: any;
      name: string;
    }>;
    pageInfo: { __typename?: 'SpacePageInfo'; totalCount: number };
  };
};

export type GetSpaceFormQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetSpaceFormQuery = {
  __typename?: 'Query';
  spaceForm: {
    __typename?: 'SpaceForm';
    name: string;
    address: string;
    phone: string;
  };
};

export type GetTimelineQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetTimelineQuery = {
  __typename?: 'Query';
  timeline: { __typename?: 'Timeline'; date: any };
};

export type GetTimelinesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetTimelinesQuery = {
  __typename?: 'Query';
  timelines: {
    __typename?: 'PaginatedTimeline';
    nodes: Array<{
      __typename?: 'Timeline';
      id: string;
      date: any;
      createdAt: any;
    }>;
    pageInfo: { __typename?: 'TimelinePageInfo'; totalCount: number };
  };
};

export type GetTimelineFormQueryVariables = Exact<{
  timelineId: Scalars['String']['input'];
  sessionId: Scalars['String']['input'];
}>;

export type GetTimelineFormQuery = {
  __typename?: 'Query';
  timelineForm: {
    __typename?: 'TimelineForm';
    sessionId: string;
    date?: any | null;
    session: { __typename?: 'Session'; name: string; dates: Array<any> };
  };
};

export type GetUserQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetUserQuery = {
  __typename?: 'Query';
  user: {
    __typename?: 'User';
    id: string;
    email: string;
    profiles: Array<{
      __typename?: 'Profile';
      nickname: string;
      phone: string;
    }>;
  };
};

export type GetUsersQueryVariables = Exact<{
  email?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  sortingKey?: InputMaybe<Scalars['String']['input']>;
  sortingValue?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetUsersQuery = {
  __typename?: 'Query';
  users: {
    __typename?: 'PaginatedUser';
    nodes: Array<{ __typename?: 'User'; id: string; email: string }>;
    pageInfo: {
      __typename?: 'UserPageInfo';
      endCursor?: string | null;
      totalCount: number;
    };
  };
};

export type GetUserFormQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetUserFormQuery = {
  __typename?: 'Query';
  userForm: {
    __typename?: 'UserForm';
    name: string;
    email: string;
    password: string;
    roleId?: string | null;
    spaceId?: string | null;
    roleOptions: Array<{ __typename?: 'Option'; name: string; value: string }>;
    spaceOptions: Array<{ __typename?: 'Option'; name: string; value: string }>;
  };
};

export const LoginDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'Login' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'LoginInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'login' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'data' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'accessToken' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'refreshToken' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const SignUpDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SignUp' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'signUpInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'SignupInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'signup' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'signUpInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const CreateCategoryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateCategory' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createCategoryInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateCategoryInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createCategory' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createCategoryInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createCategoryInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateCategoryMutation,
  CreateCategoryMutationVariables
>;
export const DeleteCategoriesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteCategories' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'ids' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: { kind: 'Name', value: 'String' },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteCategories' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'ids' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'ids' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteCategoriesMutation,
  DeleteCategoriesMutationVariables
>;
export const RemoveCategoryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveCategory' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeCategory' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RemoveCategoryMutation,
  RemoveCategoryMutationVariables
>;
export const UpdateCategoryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateCategory' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateCategoryInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateCategoryInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateCategory' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateCategoryInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updateCategoryInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateCategoryMutation,
  UpdateCategoryMutationVariables
>;
export const CreateCategoryItemDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateCategoryItem' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createCategoryItemInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateCategoryItemInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createCategoryItem' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createCategoryItemInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createCategoryItemInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'parentId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateCategoryItemMutation,
  CreateCategoryItemMutationVariables
>;
export const DeleteCategoryItemDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteCategoryItem' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteCategoryItem' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deletedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteCategoryItemMutation,
  DeleteCategoryItemMutationVariables
>;
export const UpdateCategoryItemDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateCategoryItem' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateCategoryItemInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateCategoryItemInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateCategoryItem' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateCategoryItemInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updateCategoryItemInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deletedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateCategoryItemMutation,
  UpdateCategoryItemMutationVariables
>;
export const CreateGroupDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateGroup' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createGroupInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateGroupInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createGroup' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createGroupInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createGroupInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateGroupMutation, CreateGroupMutationVariables>;
export const DeleteGroupDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteGroup' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteGroup' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteGroupMutation, DeleteGroupMutationVariables>;
export const UpdateGroupDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateGroup' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateGroupInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateGroupInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateGroup' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateGroupInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updateGroupInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateGroupMutation, UpdateGroupMutationVariables>;
export const CreateRoleDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateRole' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createRoleInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateRoleInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createRole' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createRoleInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createRoleInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateRoleMutation, CreateRoleMutationVariables>;
export const DeleteRoleDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteRole' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteRole' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const RemoveRoleDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveRole' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeRole' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveRoleMutation, RemoveRoleMutationVariables>;
export const UpdateRoleDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateRole' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateRoleInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateRoleInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateRole' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateRoleInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updateRoleInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const CreateServiceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateService' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createServiceInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateServiceInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createService' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createServiceInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createServiceInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateServiceMutation,
  CreateServiceMutationVariables
>;
export const DeleteServiceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteService' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteService' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteServiceMutation,
  DeleteServiceMutationVariables
>;
export const UpdateServiceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateService' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateServiceInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateServiceInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateService' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateServiceInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updateServiceInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateServiceMutation,
  UpdateServiceMutationVariables
>;
export const CreateSessionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateSession' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createSessionInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateSessionInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createSession' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createSessionInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createSessionInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateSessionMutation,
  CreateSessionMutationVariables
>;
export const DeleteSessionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteSession' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteSession' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteSessionMutation,
  DeleteSessionMutationVariables
>;
export const UpdateSessionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateSession' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateSessionInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateSessionInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateSession' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateSessionInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updateSessionInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateSessionMutation,
  UpdateSessionMutationVariables
>;
export const CreateSpaceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateSpace' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createSpaceInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateSpaceInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createSpace' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createSpaceInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createSpaceInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateSpaceMutation, CreateSpaceMutationVariables>;
export const DeleteSpaceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteSpace' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteSpace' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteSpaceMutation, DeleteSpaceMutationVariables>;
export const UpdateSpaceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateSpace' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateSpaceInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateSpaceInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateSpace' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateSpaceInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updateSpaceInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateSpaceMutation, UpdateSpaceMutationVariables>;
export const CreateTimelineDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateTimeline' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createTimelineInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateTimelineInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createTimeline' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createTimelineInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createTimelineInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'date' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateTimelineMutation,
  CreateTimelineMutationVariables
>;
export const DeleteTimelineDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteTimeline' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteTimeline' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteTimelineMutation,
  DeleteTimelineMutationVariables
>;
export const UpdateTimelineDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateTimeline' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateTimelineInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateTimelineInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateTimeline' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateTimelineInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updateTimelineInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateTimelineMutation,
  UpdateTimelineMutationVariables
>;
export const CreateUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createUserInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateUserInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createUserInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createUserInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateUserInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateUserInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateUserInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updateUserInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const GetCategoriesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCategories' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'take' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'take' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deletedAt' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'endCursor' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalCount' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetCategoryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCategory' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'category' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetCategoryQuery, GetCategoryQueryVariables>;
export const GetCategoryFormDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCategoryForm' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categoryForm' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'itemId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'serviceId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'itemOptions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'serviceOptions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCategoryFormQuery,
  GetCategoryFormQueryVariables
>;
export const GetCategoryItemDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCategoryItem' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categoryItem' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'parentId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCategoryItemQuery,
  GetCategoryItemQueryVariables
>;
export const GetCategoryItemsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCategoryItems' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingKey' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingValue' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categoryItems' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'take' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'take' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingKey' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingKey' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingValue' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingValue' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'endCursor' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalCount' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCategoryItemsQuery,
  GetCategoryItemsQueryVariables
>;
export const GetCategoryItemFormDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCategoryItemForm' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categoryItemForm' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ancestorIds' } },
                { kind: 'Field', name: { kind: 'Name', value: 'parentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tag' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tenantId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCategoryItemFormQuery,
  GetCategoryItemFormQueryVariables
>;
export const GetCategoryItemTreesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCategoryItemTrees' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categoryItemTrees' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tag' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ancestorIds' } },
                { kind: 'Field', name: { kind: 'Name', value: 'parentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deletedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCategoryItemTreesQuery,
  GetCategoryItemTreesQueryVariables
>;
export const GetGroupDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetGroup' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'group' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGroupQuery, GetGroupQueryVariables>;
export const GetGroupsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetGroups' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingKey' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingValue' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'groups' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'take' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'take' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingKey' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingKey' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingValue' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingValue' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalCount' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGroupsQuery, GetGroupsQueryVariables>;
export const GetGroupFormDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetGroupForm' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'groupForm' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tenantId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'serviceId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGroupFormQuery, GetGroupFormQueryVariables>;
export const GetRoleDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetRole' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'role' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetRoleQuery, GetRoleQueryVariables>;
export const GetRolesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetRoles' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingKey' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingValue' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'roles' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'take' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'take' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingKey' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingKey' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingValue' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingValue' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deletedAt' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalCount' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetRolesQuery, GetRolesQueryVariables>;
export const GetRoleFormDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetRoleForm' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'roleForm' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'options' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetRoleFormQuery, GetRoleFormQueryVariables>;
export const GetServiceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetService' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'service' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetServiceQuery, GetServiceQueryVariables>;
export const GetServicesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetServices' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingKey' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingValue' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'services' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'take' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'take' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingKey' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingKey' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingValue' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingValue' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalCount' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetServicesQuery, GetServicesQueryVariables>;
export const GetServiceFormDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetServiceForm' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'serviceForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetServiceFormQuery, GetServiceFormQueryVariables>;
export const GetSessionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSession' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'session' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSessionQuery, GetSessionQueryVariables>;
export const GetSessionsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSessions' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingKey' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingValue' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'sessions' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'take' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'take' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingKey' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingKey' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingValue' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingValue' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalCount' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSessionsQuery, GetSessionsQueryVariables>;
export const GetSessionFormDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSessionForm' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'sessionForm' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'dates' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tenantId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSessionFormQuery, GetSessionFormQueryVariables>;
export const GetSpaceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSpace' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'space' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSpaceQuery, GetSpaceQueryVariables>;
export const GetSpacesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSpaces' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingKey' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingValue' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'spaces' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'take' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'take' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingKey' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingKey' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingValue' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingValue' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'address' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'phone' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalCount' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSpacesQuery, GetSpacesQueryVariables>;
export const GetSpaceFormDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSpaceForm' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'spaceForm' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                { kind: 'Field', name: { kind: 'Name', value: 'phone' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSpaceFormQuery, GetSpaceFormQueryVariables>;
export const GetTimelineDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetTimeline' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'timeline' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'date' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTimelineQuery, GetTimelineQueryVariables>;
export const GetTimelinesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetTimelines' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingKey' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingValue' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'timelines' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'take' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'take' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingKey' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingKey' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingValue' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingValue' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalCount' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTimelinesQuery, GetTimelinesQueryVariables>;
export const GetTimelineFormDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetTimelineForm' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'timelineId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sessionId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'timelineForm' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'timelineId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'timelineId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sessionId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sessionId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'sessionId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'session' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'dates' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetTimelineFormQuery,
  GetTimelineFormQueryVariables
>;
export const GetUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'profiles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'nickname' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'phone' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const GetUsersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetUsers' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'email' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingKey' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'sortingValue' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'users' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'email' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'take' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'take' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingKey' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingKey' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortingValue' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'sortingValue' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'endCursor' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalCount' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const GetUserFormDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetUserForm' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userForm' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'password' } },
                { kind: 'Field', name: { kind: 'Name', value: 'roleId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'spaceId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roleOptions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'spaceOptions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUserFormQuery, GetUserFormQueryVariables>;

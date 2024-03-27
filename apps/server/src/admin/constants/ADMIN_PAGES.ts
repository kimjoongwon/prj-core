export const ADMIN_DASHBOARD_SERVICE = 'admin/dashboard-service';
// export const ADMIN_USER_SERVICE = 'admin/user-service';
export const ADMIN_USER_SERVICE_USERS = 'admin/user-service/users';
export const ADMIN_USER_SERVICE_USER = 'admin/user-service/users/:userId';
export const ADMIN_USER_SERVICE_USER_ROLES =
  'admin/user-service/users/:userId/roles';
export const ADMIN_USER_SERVICE_USER_ROLE =
  'admin/user-service/users/:userId/roles/:roleId';
export const ADMIN_USER_SERVICE_CATEGORIES =
  'admin/user-service/:serviceId/categories';
export const ADMIN_USER_SERVICE_CATEGORY =
  'admin/user-service/:serviceId/categories/:categoryId';
export const ADMIN_USER_SERVICE_GROUPS = 'admin/user-service/:serviceId/groups';
export const ADMIN_USER_SERVICE_GROUP =
  'admin/user-service/:serviceId/groups/:groupId';
// const test = ADMIN_USER_SERVICE_GROUPS + ADMIN_USER_SERVICE_GROUP;
const ADMIN = '/admin';
const USER_SERVICE = '/user-service';
const USERS = '/users';
const USER_ID = '/:userId';
const ROLES = '/roles';

export enum ADMIN_PAGES {
  ADMIN_USER_SERVICE = ADMIN + USER_SERVICE,
  ADMIN_USER_SERVICE_USERS = ADMIN_PAGES.ADMIN_USER_SERVICE + USERS,
  ADMIN_USER_SERVICE_USER = ADMIN_PAGES.ADMIN_USER_SERVICE + USER_ID,
  ADMIN_USER_SERVICE_USER_ROLES = ADMIN_PAGES.ADMIN_USER_SERVICE + ROLES,
  ADMIN_USER_SERVICE_USER_ROLE = ADMIN_PAGES.ADMIN_USER_SERVICE + '/:roleId',
  ADMIN_USER_SERVICE_CATEGORIES = 'admin/user-service/:serviceId/categories',
  ADMIN_USER_SERVICE_CATEGORY = 'admin/user-service/:serviceId/categories/:categoryId',
  ADMIN_USER_SERVICE_GROUPS = 'admin/user-service/:serviceId/groups',
  ADMIN_USER_SERVICE_GROUP = 'admin/user-service/:serviceId/groups/:groupId',
}

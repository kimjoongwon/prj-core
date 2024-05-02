export const ADMIN_PATH = '/admin' as const;
export const DASHBOARD_PAGE_PATH = `${ADMIN_PATH}/dashboard` as const;
export const ADMIN_AUTH_PATH = `${ADMIN_PATH}/auth` as const;
export const ADMIN_AUTH_LOGIN_PATH = `${ADMIN_AUTH_PATH}/login` as const;
export const ADMIN_MAIN_PATH = `${ADMIN_PATH}/main` as const;

export const ADMIN_SERVICES_PATH = `${ADMIN_MAIN_PATH}/services` as const;
export const ADMIN_SERVICE_PATH =
  `${ADMIN_MAIN_PATH}/services/:serviceId` as const;

export const ADMIN_MAIN_SERVICE_CATEGORIES_PATH =
  `${ADMIN_SERVICE_PATH}/categories` as const;
export const ADMIN_MAIN_SERVICE_CATEGORY_EDIT_PATH =
  `${ADMIN_SERVICE_PATH}/categories/:categoryId/edit` as const;
export const ADMIN_MAIN_SERVICE_CATEGORY_PATH =
  `${ADMIN_SERVICE_PATH}/categories/:categoryId` as const;

export type Paths =
  | typeof ADMIN_MAIN_PATH
  | typeof DASHBOARD_PAGE_PATH
  | typeof ADMIN_AUTH_PATH
  | typeof ADMIN_AUTH_LOGIN_PATH
  | typeof ADMIN_MAIN_PATH
  | typeof ADMIN_SERVICES_PATH
  | typeof ADMIN_MAIN_SERVICE_CATEGORIES_PATH
  | typeof ADMIN_MAIN_SERVICE_CATEGORY_EDIT_PATH
  | typeof ADMIN_MAIN_SERVICE_CATEGORY_PATH;

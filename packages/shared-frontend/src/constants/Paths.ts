export const ADMIN_PATH = '/admin' as const;
export const DASHBOARD_PAGE_PATH = `${ADMIN_PATH}/dashboard` as const;
export const ADMIN_AUTH_PATH = `${ADMIN_PATH}/auth` as const;
export const ADMIN_AUTH_LOGIN_PATH = `${ADMIN_AUTH_PATH}/login` as const;
export const ADMIN_MAIN_PATH = `${ADMIN_PATH}/main` as const;

export const ADMIN_USER_SERVICE_PATH =
  `${ADMIN_MAIN_PATH}/userService` as const;

export const ADMIN_RESERVATION_SERVICE_PATH =
  `${ADMIN_MAIN_PATH}/reservationService` as const;

export const ADMIN_USER_CATEGORIES_PATH =
  `${ADMIN_USER_SERVICE_PATH}/categories` as const;

export const ADMIN_USER_CATEGORY_PATH =
  `${ADMIN_USER_CATEGORIES_PATH}/:categoryId` as const;

export const ADMIN_USER_CATEGORY_EDIT_PATH =
  `${ADMIN_USER_CATEGORIES_PATH}/:categoryId/edit` as const;

export const ADMIN_SETTING_SERVICE_PATH =
  `${ADMIN_MAIN_PATH}/settingService` as const;

export const ADMIN_SERVICES_PATH =
  `${ADMIN_SETTING_SERVICE_PATH}/services` as const;

export const ADMIN_SERVICE_EDIT_PATH =
  `${ADMIN_SERVICES_PATH}/:serviceId/edit` as const;

export type Paths =
  | typeof ADMIN_PATH
  | typeof ADMIN_MAIN_PATH
  | typeof DASHBOARD_PAGE_PATH
  | typeof ADMIN_AUTH_PATH
  | typeof ADMIN_AUTH_LOGIN_PATH
  | typeof ADMIN_MAIN_PATH
  | typeof ADMIN_USER_SERVICE_PATH
  | typeof ADMIN_USER_CATEGORIES_PATH
  | typeof ADMIN_USER_CATEGORY_PATH
  | typeof ADMIN_SETTING_SERVICE_PATH
  | typeof ADMIN_SERVICES_PATH
  | typeof ADMIN_SERVICE_EDIT_PATH
  | typeof ADMIN_USER_CATEGORY_EDIT_PATH
  | typeof ADMIN_RESERVATION_SERVICE_PATH;

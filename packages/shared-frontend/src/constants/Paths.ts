export const ADMIN_PATH = '/admin' as const;
export const DASHBOARD_PAGE_PATH = `${ADMIN_PATH}/dashboard` as const;
export const ADMIN_AUTH_PATH = `${ADMIN_PATH}/auth` as const;
export const ADMIN_AUTH_LOGIN_PATH = `${ADMIN_AUTH_PATH}/login` as const;
export const ADMIN_MAIN_PATH = `${ADMIN_PATH}/main` as const;

export const ADMIN_SERVICE_PATH =
  `${ADMIN_MAIN_PATH}/services/:serviceId` as const;

export const ADMIN_SERVICES_PATH = `${ADMIN_MAIN_PATH}/services` as const;

// 매장관리 > 공간 관리
export const ADMIN_SERVICE_SPACES_PATH =
  `${ADMIN_SERVICE_PATH}/spaces` as const;

export const ADMIN_SERVICE_SPACE_PATH =
  `${ADMIN_SERVICE_PATH}/spaces/:spaceId` as const;

export const ADMIN_SERVICE_SPACE_EDIT_PATH =
  `${ADMIN_SERVICE_PATH}/spaces/:spaceId/edit` as const;
//
// 예약관리 > 타임라인관리
export const ADMIN_SERVICE_TIMELINE_ITEMS_PATH =
  `${ADMIN_SERVICE_PATH}/timelineItems` as const;

export const ADMIN_SERVICE_TIMELINE_ITEM_PATH =
  `${ADMIN_SERVICE_PATH}/timelineItems/:timelineItemId` as const;

export const ADMIN_SERVICE_TIMELINE_ITEM_EDIT_PATH =
  `${ADMIN_SERVICE_PATH}/timelineItems/:timelineItemId/edit` as const;
//
// 예약관리 > 세션 관리
export const ADMIN_SERVICE_SESSIONS_PATH =
  `${ADMIN_SERVICE_PATH}/sessions` as const;

export const ADMIN_SERVICE_SESSION_PATH =
  `${ADMIN_SERVICE_PATH}/sessions/:sessionId` as const;

export const ADMIN_SERVICE_SESSION_EDIT_PATH =
  `${ADMIN_SERVICE_PATH}/sessions/:sessionId/edit` as const;
//
// 템플릿 관리
export const ADMIN_SERVICE_TEMPLATES_PATH =
  `${ADMIN_SERVICE_PATH}/templates` as const;

export const ADMIN_SERVICE_TEMPLATE_PATH =
  `${ADMIN_SERVICE_PATH}/templates/:templateId` as const;

export const ADMIN_SERVICE_TEMPLATE_EDIT_PATH =
  `${ADMIN_SERVICE_PATH}/templates/:templateId/edit` as const;
//
export const ADMIN_USER_CATEGORIES_PATH =
  `${ADMIN_SERVICE_PATH}/categories` as const;

export const ADMIN_USER_GROUPS_PATH = `${ADMIN_SERVICE_PATH}/groups` as const;

export const ADMIN_USER_CATEGORY_PATH =
  `${ADMIN_USER_CATEGORIES_PATH}/:categoryId` as const;

export const ADMIN_USER_CATEGORY_EDIT_PATH =
  `${ADMIN_USER_CATEGORIES_PATH}/:categoryId/edit` as const;

export const ADMIN_SETTING_SERVICE_PATH =
  `${ADMIN_MAIN_PATH}/settingService` as const;

export const ADMIN_SERVICE_EDIT_PATH = `${ADMIN_SERVICE_PATH}/edit` as const;

export type Paths =
  | typeof ADMIN_PATH
  | typeof ADMIN_MAIN_PATH
  | typeof DASHBOARD_PAGE_PATH
  | typeof ADMIN_AUTH_PATH
  | typeof ADMIN_AUTH_LOGIN_PATH
  | typeof ADMIN_MAIN_PATH
  | typeof ADMIN_SERVICE_PATH
  | typeof ADMIN_USER_GROUPS_PATH
  | typeof ADMIN_USER_CATEGORIES_PATH
  | typeof ADMIN_USER_CATEGORY_PATH
  | typeof ADMIN_SETTING_SERVICE_PATH
  | typeof ADMIN_SERVICES_PATH
  | typeof ADMIN_SERVICE_EDIT_PATH
  // 매장
  | typeof ADMIN_SERVICE_SPACES_PATH
  | typeof ADMIN_SERVICE_SPACE_PATH
  | typeof ADMIN_SERVICE_SPACE_EDIT_PATH
  // 에약
  | typeof ADMIN_SERVICE_TIMELINE_ITEMS_PATH
  | typeof ADMIN_SERVICE_TIMELINE_ITEM_PATH
  | typeof ADMIN_SERVICE_TIMELINE_ITEM_EDIT_PATH
  // 세션
  | typeof ADMIN_SERVICE_SESSIONS_PATH
  | typeof ADMIN_SERVICE_SESSION_PATH
  | typeof ADMIN_SERVICE_SESSION_EDIT_PATH
  // 템플릿
  | typeof ADMIN_SERVICE_TEMPLATES_PATH
  | typeof ADMIN_SERVICE_TEMPLATE_PATH
  | typeof ADMIN_SERVICE_TEMPLATE_EDIT_PATH
  //
  | typeof ADMIN_USER_CATEGORY_EDIT_PATH;

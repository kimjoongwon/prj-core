export const ADMIN_PATH = '/admin';
export const DASHBOARD_PAGE_PATH = `${ADMIN_PATH}/dashboard`;
export const ADMIN_AUTH_PATH = `${ADMIN_PATH}/auth`;
export const ADMIN_AUTH_LOGIN_PATH = `${ADMIN_AUTH_PATH}/login`;
export const ADMIN_MAIN_PATH = `${ADMIN_PATH}/main`;

export const PATH = `/admin/main/services/:serviceId`;
export const SERVICE_PATH = `/admin/main/services/:serviceId`;

// 매장관리 > 공간 관리
export const SPACES_PATH = `/admin/main/services/:serviceId/spaces`;
export const SPACE_PATH = `/admin/main/services/:serviceId/spaces/:spaceId`;
export const SPACE_EDIT_PATH = `/admin/main/services/:serviceId/spaces/:spaceId/edit`;

// 예약관리 > 타임라인관리
export const TIMELINE_ITEMS_PATH = `/admin/main/services/:serviceId/timelineItems`;
export const TIMELINE_ITEM_PATH = `/admin/main/services/:serviceId/timelineItems/:timelineItemId`;
export const TIMELINE_ITEM_EDIT_PATH = `/admin/main/services/:serviceId/timelineItems/:timelineItemId/edit`;

// 세션 > 세션 관리
export const SESSIONS_PATH = `/admin/main/services/:serviceId/sessions`;
export const SESSION_PATH = `/admin/main/services/:serviceId/sessions/:sessionId`;
export const SESSION_EDIT_PATH = `/admin/main/services/:serviceId/sessions/:sessionId/edit`;

// 예약 > 예약 관리
export const RESERVATIONS_PATH = `/admin/main/services/:serviceId/reservations`;
export const RESERVATION_PATH = `/admin/main/services/:serviceId/reservations/:reservationId`;
export const RESERVATION_EDIT_PATH = `/admin/main/services/:serviceId/reservations/:reservationId/edit`;

// 템플릿 관리
export const TEMPLATES_PATH = `/admin/main/services/:serviceId/templates`;
export const TEMPLATE_PATH = `/admin/main/services/:serviceId/templates/:templateId`;
export const TEMPLATE_EDIT_PATH = `/admin/main/services/:serviceId/templates/:templateId/edit`;

// 이용자 관리
export const USERS_PATH = `/admin/main/services/:serviceId/users`;
export const USER_PATH = `/admin/main/services/:serviceId/users/:userId`;
export const USER_EDIT_PATH = `/admin/main/services/:serviceId/users/:userId/edit`;

// 그룹
export const GROUPS_PATH = `/admin/main/services/:serviceId/groups`;
export const GROUP_PATH = `/admin/main/services/:serviceId/groups/:groupId`;
export const GROUP_EDIT_PATH = `/admin/main/services/:serviceId/groups/:groupId/edit`;
// 카테고리
export const CATEGORIES_PATH = `/admin/main/services/:serviceId/categories`;
export const CATEGORY_PATH = `/admin/main/services/:serviceId/categories/:categoryId`;
export const CATEGORY_EDIT_PATH = `/admin/main/services/:serviceId/categories/:categoryId/edit`;

export type Paths =
  // 서비스
  | typeof SERVICE_PATH
  | typeof ADMIN_MAIN_PATH
  | typeof ADMIN_AUTH_PATH
  | typeof ADMIN_AUTH_LOGIN_PATH
  // 그룹
  | typeof GROUPS_PATH
  | typeof GROUP_PATH
  | typeof GROUP_EDIT_PATH
  // 이용자
  | typeof USERS_PATH
  | typeof USER_PATH
  | typeof USER_EDIT_PATH
  // 카테고리
  | typeof CATEGORIES_PATH
  | typeof CATEGORY_PATH
  | typeof CATEGORY_EDIT_PATH
  // 매장
  | typeof SPACES_PATH
  | typeof SPACE_PATH
  | typeof SPACE_EDIT_PATH
  // 세션
  | typeof SESSIONS_PATH
  | typeof SESSION_PATH
  | typeof SESSION_EDIT_PATH
  // 타임라인
  | typeof TIMELINE_ITEMS_PATH
  | typeof TIMELINE_ITEM_PATH
  | typeof TIMELINE_ITEM_EDIT_PATH
  // 예약
  | typeof RESERVATIONS_PATH
  | typeof RESERVATION_PATH
  | typeof RESERVATION_EDIT_PATH
  // 템플릿
  | typeof TEMPLATES_PATH
  | typeof TEMPLATE_PATH
  | typeof TEMPLATE_EDIT_PATH;

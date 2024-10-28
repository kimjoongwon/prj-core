export const ADMIN_PATH = '/admin';
export const DASHBOARD_PAGE_PATH = `${ADMIN_PATH}/dashboard`;
export const ADMIN_AUTH_PATH = `${ADMIN_PATH}/auth`;
export const ADMIN_AUTH_LOGIN_PATH = `${ADMIN_AUTH_PATH}/login`;
export const ADMIN_MAIN_PATH = `${ADMIN_PATH}/main`;

export const BOTTOM_TAB_APP_PATH = `/admin/main/app`;
export const BOTTOM_TAB_RESERVATION_PATH = `/admin/main/reservation`;
export const SERVICES_PATH = `/admin/main/app/services`;
export const SERVICE_PATH = `/admin/main/app/services/:serviceId`;
export const SERVICE_EDIT_PATH = `/admin/main/app/services/:serviceId/edit`;

// 매장관리 > 공간 관리
export const SPACES_PATH = `/admin/main/gym/spaces`;
export const SPACE_PATH = `/admin/main/gym/spaces/:spaceId`;
export const SPACE_EDIT_PATH = `/admin/main/gym/spaces/:spaceId/edit`;

// 예약관리 > 타임라인관리
export const TIMELINE_ITEMS_PATH = `/admin/main/reservation/timelineItems`;
export const TIMELINE_ITEM_PATH = `/admin/main/reservation/timelineItems/:timelineItemId`;
export const TIMELINE_ITEM_EDIT_PATH = `/admin/main/reservation/timelineItems/:timelineItemId/edit`;

// 세션 > 세션 관리
export const SESSIONS_PATH = `/admin/main/reservation/sessions`;
export const SESSION_PATH = `/admin/main/reservation/sessions/:sessionId`;
export const SESSION_EDIT_PATH = `/admin/main/reservation/sessions/:sessionId/edit`;

// 예약 > 예약 관리
export const RESERVATIONS_PATH = `/admin/main/reservations`;
export const RESERVATION_PATH = `/admin/main/reservations/:reservationId`;
export const RESERVATION_EDIT_PATH = `/admin/main/reservations/:reservationId/edit`;

// 템플릿 관리
export const TEMPLATES_PATH = `/admin/main/app/templates`;
export const TEMPLATE_PATH = `/admin/main/app/templates/:templateId`;
export const TEMPLATE_EDIT_PATH = `/admin/main/app/templates/:templateId/edit`;

// 이용자 관리
export const USERS_PATH = `/admin/main/users`;
export const USER_PATH = `/admin/main/users/:userId`;
export const USER_EDIT_PATH = `/admin/main/users/:userId/edit`;

// 그룹
export const GROUPS_PATH = `/admin/main/app/services/:serviceId/groups`;
export const GROUP_PATH = `/admin/main/app/services/:serviceId/groups/:groupId`;
export const GROUP_EDIT_PATH = `/admin/main/app/services/:serviceId/groups/:groupId/edit`;

// 카테고리
export const CATEGORIES_PATH = `/admin/main/app/services/:serviceId/categories`;
export const CATEGORY_PATH = `/admin/main/app/services/:serviceId/categories/:categoryId`;
export const CATEGORY_EDIT_PATH = `/admin/main/app/services/:serviceId/categories/:categoryId/edit`;

export const USER_SERVICE_PATH = `/admin/main/user-service`;
export const USER_SERVICE_USERS_PATH = `${USER_SERVICE_PATH}/users`;
export const USER_SERVICE_USER_PATH = `${USER_SERVICE_PATH}/users/:userId`;
export const USER_SERVICE_USER_EDIT_PATH = `${USER_SERVICE_PATH}/users/:userId/edit`;
export const USER_SERVICE_GROUPS_PATH = `${USER_SERVICE_PATH}/groups`;
export const USER_SERVICE_GROUP_PATH = `${USER_SERVICE_PATH}/groups/:groupId`;
export const USER_SERVICE_GROUP_EDIT_PATH = `${USER_SERVICE_PATH}/groups/:groupId/edit`;
export const USER_SERVICE_CATEGORIES_PATH = `${USER_SERVICE_PATH}/categories`;
export const USER_SERVICE_CATEGORY_PATH = `${USER_SERVICE_PATH}/categories/:categoryId`;
export const USER_SERVICE_CATEGORY_EDIT_PATH = `${USER_SERVICE_PATH}/categories/:categoryId/edit`;

export const SPACE_SERVICE_PATH = `/admin/main/space-service`;
export const SPACE_SERVICE_SPACES_PATH = `${SPACE_SERVICE_PATH}/spaces`;
export const SPACE_SERVICE_SPACE_PATH = `${SPACE_SERVICE_PATH}/spaces/:spaceId`;
export const SPACE_SERVICE_SPACE_EDIT_PATH = `${SPACE_SERVICE_PATH}/spaces/:spaceId/edit`;
export const SPACE_SERVICE_GROUPS_PATH = `${SPACE_SERVICE_PATH}/groups`;
export const SPACE_SERVICE_GROUP_PATH = `${SPACE_SERVICE_PATH}/groups/:groupId`;
export const SPACE_SERVICE_GROUP_EDIT_PATH = `${SPACE_SERVICE_PATH}/groups/:groupId/edit`;
export const SPACE_SERVICE_CATEGORIES_PATH = `${SPACE_SERVICE_PATH}/categories`;
export const SPACE_SERVICE_CATEGORY_PATH = `${SPACE_SERVICE_PATH}/categories/:categoryId`;
export const SPACE_SERVICE_CATEGORY_EDIT_PATH = `${SPACE_SERVICE_PATH}/categories/:categoryId/edit`;

export const POST_SERVICE_PATH = `/admin/main/post-service`;
export const POST_SERVICE_POSTS_PATH = `${POST_SERVICE_PATH}/posts`;
export const POST_SERVICE_POST_PATH = `${POST_SERVICE_PATH}/posts/:postId`;
export const POST_SERVICE_POST_EDIT_PATH = `${POST_SERVICE_PATH}/posts/:postId/edit`;
export const POST_SERVICE_GROUPS_PATH = `${POST_SERVICE_PATH}/groups`;
export const POST_SERVICE_GROUP_PATH = `${POST_SERVICE_PATH}/groups/:groupId`;
export const POST_SERVICE_GROUP_EDIT_PATH = `${POST_SERVICE_PATH}/groups/:groupId/edit`;
export const POST_SERVICE_CATEGORIES_PATH = `${POST_SERVICE_PATH}/categories`;
export const POST_SERVICE_CATEGORY_PATH = `${POST_SERVICE_PATH}/categories/:categoryId`;
export const POST_SERVICE_CATEGORY_EDIT_PATH = `${POST_SERVICE_PATH}/categories/:categoryId/edit`;

export const DEPOT_FILE_SERVICE_PATH = `/admin/main/file-service`;
export const DEPOT_FILE_SERVICE_FILES_PATH = `${DEPOT_FILE_SERVICE_PATH}/files`;
export const DEPOT_FILE_SERVICE_FILE_PATH = `${DEPOT_FILE_SERVICE_PATH}/files/:fileId`;
export const DEPOT_FILE_SERVICE_FILE_EDIT_PATH = `${DEPOT_FILE_SERVICE_PATH}/files/:fileId/edit`;
export const DEPOT_FILE_SERVICE_GROUPS_PATH = `${DEPOT_FILE_SERVICE_PATH}/groups`;
export const DEPOT_FILE_SERVICE_GROUP_PATH = `${DEPOT_FILE_SERVICE_PATH}/groups/:groupId`;
export const DEPOT_FILE_SERVICE_GROUP_EDIT_PATH = `${DEPOT_FILE_SERVICE_PATH}/groups/:groupId/edit`;
export const DEPOT_FILE_SERVICE_CATEGORIES_PATH = `${DEPOT_FILE_SERVICE_PATH}/categories`;
export const DEPOT_FILE_SERVICE_CATEGORY_PATH = `${DEPOT_FILE_SERVICE_PATH}/categories/:categoryId`;
export const DEPOT_FILE_SERVICE_CATEGORY_EDIT_PATH = `${DEPOT_FILE_SERVICE_PATH}/categories/:categoryId/edit`;

export type Paths =
  | typeof POST_SERVICE_PATH
  | typeof POST_SERVICE_POSTS_PATH
  | typeof POST_SERVICE_POST_PATH
  | typeof POST_SERVICE_POST_EDIT_PATH
  | typeof POST_SERVICE_GROUPS_PATH
  | typeof POST_SERVICE_GROUP_PATH
  | typeof POST_SERVICE_GROUP_EDIT_PATH
  | typeof POST_SERVICE_CATEGORIES_PATH
  | typeof POST_SERVICE_CATEGORY_PATH
  | typeof POST_SERVICE_CATEGORY_EDIT_PATH
  | typeof DEPOT_FILE_SERVICE_PATH
  | typeof DEPOT_FILE_SERVICE_FILES_PATH
  | typeof DEPOT_FILE_SERVICE_FILE_PATH
  | typeof DEPOT_FILE_SERVICE_FILE_EDIT_PATH
  | typeof DEPOT_FILE_SERVICE_GROUPS_PATH
  | typeof DEPOT_FILE_SERVICE_GROUP_PATH
  | typeof DEPOT_FILE_SERVICE_GROUP_EDIT_PATH
  | typeof DEPOT_FILE_SERVICE_CATEGORIES_PATH
  | typeof DEPOT_FILE_SERVICE_CATEGORY_PATH
  | typeof DEPOT_FILE_SERVICE_CATEGORY_EDIT_PATH
  | typeof SPACE_SERVICE_PATH
  | typeof SPACE_SERVICE_SPACES_PATH
  | typeof SPACE_SERVICE_SPACE_PATH
  | typeof SPACE_SERVICE_SPACE_EDIT_PATH
  | typeof SPACE_SERVICE_GROUPS_PATH
  | typeof SPACE_SERVICE_GROUP_PATH
  | typeof SPACE_SERVICE_GROUP_EDIT_PATH
  | typeof SPACE_SERVICE_CATEGORIES_PATH
  | typeof SPACE_SERVICE_CATEGORY_PATH
  | typeof SPACE_SERVICE_CATEGORY_EDIT_PATH
  | typeof USER_SERVICE_PATH
  | typeof USER_SERVICE_USERS_PATH
  | typeof USER_SERVICE_USER_PATH
  | typeof USER_SERVICE_USER_EDIT_PATH
  | typeof USER_SERVICE_GROUPS_PATH
  | typeof USER_SERVICE_GROUP_PATH
  | typeof USER_SERVICE_GROUP_EDIT_PATH
  | typeof USER_SERVICE_CATEGORIES_PATH
  | typeof USER_SERVICE_CATEGORY_PATH
  | typeof USER_SERVICE_CATEGORY_EDIT_PATH
  | typeof CATEGORIES_PATH
  | typeof CATEGORY_PATH
  | typeof CATEGORY_EDIT_PATH
  | typeof GROUPS_PATH
  | typeof GROUP_PATH
  | typeof GROUP_EDIT_PATH
  // 서비스
  | typeof BOTTOM_TAB_APP_PATH
  | typeof BOTTOM_TAB_RESERVATION_PATH
  | typeof SERVICE_PATH
  | typeof SERVICES_PATH
  | typeof SERVICE_EDIT_PATH
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

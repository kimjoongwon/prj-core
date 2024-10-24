export const ADMIN_PATH = '/admin';
export const DASHBOARD_PAGE_PATH = `${ADMIN_PATH}/dashboard`;
export const ADMIN_AUTH_PATH = `${ADMIN_PATH}/auth`;
export const ADMIN_AUTH_LOGIN_PATH = `${ADMIN_AUTH_PATH}/login`;
export const ADMIN_MAIN_PATH = `${ADMIN_PATH}/main`;

export const BOTTOM_TAB_APP_PATH = `/admin/main/app`;
export const BOTTOM_TAB_LECTURES_PATH = `/admin/main/lectures`;
export const SERVICES_PATH = `/admin/main/app/services`;
export const SERVICE_PATH = `/admin/main/app/services/:serviceId`;
export const SERVICE_EDIT_PATH = `/admin/main/app/services/:serviceId/edit`;

// 매장관리 > 공간 관리
export const SPACES_PATH = `/admin/main/gym/spaces`;
export const SPACE_PATH = `/admin/main/gym/spaces/:spaceId`;
export const SPACE_EDIT_PATH = `/admin/main/gym/spaces/:spaceId/edit`;

// 예약관리 > 타임라인관리
export const TIMELINE_ITEMS_PATH = `/admin/main/lectures/timelineItems`;
export const TIMELINE_ITEM_PATH = `/admin/main/lectures/timelineItems/:timelineItemId`;
export const TIMELINE_ITEM_EDIT_PATH = `/admin/main/lectures/timelineItems/:timelineItemId/edit`;

// 세션 > 세션 관리
export const SESSIONS_PATH = `/admin/main/lectures/sessions`;
export const SESSION_PATH = `/admin/main/lectures/sessions/:sessionId`;
export const SESSION_EDIT_PATH = `/admin/main/lectures/sessions/:sessionId/edit`;

// // 예약 > 예약 관리
// export const lecturesS_PATH = `/admin/main/lecturess`;
// export const lectures_PATH = `/admin/main/lecturess/:lecturesId`;
// export const lectures_EDIT_PATH = `/admin/main/lecturess/:lecturesId/edit`;

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

export type Paths =
  | typeof CATEGORIES_PATH
  | typeof CATEGORY_PATH
  | typeof CATEGORY_EDIT_PATH
  | typeof GROUPS_PATH
  | typeof GROUP_PATH
  | typeof GROUP_EDIT_PATH
  // 서비스
  | typeof BOTTOM_TAB_APP_PATH
  | typeof BOTTOM_TAB_LECTURES_PATH
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
  // 템플릿
  | typeof TEMPLATES_PATH
  | typeof TEMPLATE_PATH
  | typeof TEMPLATE_EDIT_PATH;

export const DASHBOARD_PATH = '/admin' as const;
export const LOGIN_PAGE_PATH = '/auth/login' as const;
export const USERS_PAGE_PATH = `${DASHBOARD_PATH}/users` as const;
export const USER_PAGE_PATH = `${DASHBOARD_PATH}/users/:userId` as const;
export const USER_EDIT_PAGE_PATH =
  `${DASHBOARD_PATH}/users/:userId/edit` as const;
export const WORKSPACES_PAGE_PATH = `${DASHBOARD_PATH}/workspaces` as const;
export const WORKSPACE_PAGE_PATH =
  `${DASHBOARD_PATH}/workspaces/:workspaceId` as const;
export const WORKSPACE_EDIT_PATH =
  `${DASHBOARD_PATH}/workspaces/:workspaceId/edit` as const;

export type Paths =
  | typeof LOGIN_PAGE_PATH
  | typeof USERS_PAGE_PATH
  | typeof USER_PAGE_PATH
  | typeof USER_EDIT_PAGE_PATH
  | typeof WORKSPACES_PAGE_PATH
  | typeof WORKSPACE_PAGE_PATH
  | typeof WORKSPACE_EDIT_PATH;

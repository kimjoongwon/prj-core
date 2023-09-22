export const LOGIN_PAGE_PATH = '/auth/login' as const
export const USERS_PAGE_PATH = '/admin/dashboard/users' as const
export const USER_PAGE_PATH = '/admin/dashboard/users/:userId' as const
export const USER_EDIT_PATH = '/admin/dashboard/users/:userId/edit' as const
export const WORKSPACES_PATH = '/admin/dashboard/workspaces' as const

export type Paths =
  | typeof LOGIN_PAGE_PATH
  | typeof USERS_PAGE_PATH
  | typeof USER_PAGE_PATH
  | typeof USER_EDIT_PATH
  | typeof WORKSPACES_PATH

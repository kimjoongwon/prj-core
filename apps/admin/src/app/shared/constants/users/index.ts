import { DASHBOARD_PATH } from '../paths';

export const USERS_PAGE_PATH = `${DASHBOARD_PATH}/users` as const;
export const USER_PAGE_PATH = `${DASHBOARD_PATH}/users/:userId` as const;
export const USER_EDIT_PAGE_PATH =
  `${DASHBOARD_PATH}/users/:userId/edit` as const;

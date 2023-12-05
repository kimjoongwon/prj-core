import { ADMIN_PATH } from '../paths';

export const USERS_PAGE_PATH = `${ADMIN_PATH}/users` as const;
export const USER_PAGE_PATH = `${ADMIN_PATH}/users/:userId` as const;
export const USER_EDIT_PAGE_PATH =
  `${ADMIN_PATH}/users/:userId/edit` as const;

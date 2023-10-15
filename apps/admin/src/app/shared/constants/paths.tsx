import { LOGIN_PAGE_PATH } from './auth';
import {
  CATEGORIES_PAGE_PATH,
  CATEGORY_EDIT_PAGE_PATH,
  CATEGORY_PAGE_PATH,
} from './categories';
import {
  CATEGORY_ITEMS_PAGE_PATH,
  CATEGORY_ITEM_EDIT_PAGE_PATH,
} from './categoryItems';
import { USERS_PAGE_PATH, USER_EDIT_PAGE_PATH, USER_PAGE_PATH } from './users';
import {
  WORKSPACES_PAGE_PATH,
  WORKSPACE_EDIT_PAGE_PATH,
  WORKSPACE_PAGE_PATH,
} from './workspaces';

export const DASHBOARD_PATH = '/admin' as const;

export type Paths =
  | typeof LOGIN_PAGE_PATH
  | typeof USERS_PAGE_PATH
  | typeof USER_PAGE_PATH
  | typeof USER_EDIT_PAGE_PATH
  | typeof WORKSPACES_PAGE_PATH
  | typeof WORKSPACE_PAGE_PATH
  | typeof WORKSPACE_EDIT_PAGE_PATH
  | typeof CATEGORY_EDIT_PAGE_PATH
  | typeof CATEGORY_PAGE_PATH
  | typeof CATEGORIES_PAGE_PATH
  | typeof CATEGORY_ITEMS_PAGE_PATH
  | typeof CATEGORY_ITEM_EDIT_PAGE_PATH;

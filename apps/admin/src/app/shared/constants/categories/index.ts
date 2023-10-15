import { DASHBOARD_PATH } from '../paths';

export const CATEGORIES_PAGE_PATH = `${DASHBOARD_PATH}/categories` as const;
export const CATEGORY_PAGE_PATH = `${DASHBOARD_PATH}/categories/:id` as const;
export const CATEGORY_EDIT_PAGE_PATH =
  `${DASHBOARD_PATH}/categories/:id/edit` as const;

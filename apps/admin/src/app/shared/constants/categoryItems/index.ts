import { ADMIN_PATH } from '../paths';

export const CATEGORY_ITEMS_PAGE_PATH =
  `${ADMIN_PATH}/categoryItems` as const;
export const CATEGORY_ITEM_EDIT_PAGE_PATH =
  `${ADMIN_PATH}/categoryItems/:categoryItemId/edit` as const;

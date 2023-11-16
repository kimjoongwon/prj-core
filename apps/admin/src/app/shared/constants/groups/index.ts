import { DASHBOARD_PATH } from '../paths';

export const GROUPS_PAGE_PATH = `${DASHBOARD_PATH}/groups` as const;
export const GROUP_PAGE_PATH =
  `${DASHBOARD_PATH}/groups/:groupId` as const;
export const GROUP_EDIT_PAGE_PATH =
  `${DASHBOARD_PATH}/groups/:groupId/edit` as const;
import { DASHBOARD_PATH } from '../paths';

export const ROLES_PAGE_PATH = `${DASHBOARD_PATH}/roles` as const;
export const ROLE_PAGE_PATH = `${DASHBOARD_PATH}/roles/:roleId` as const;
export const ROLE_EDIT_PAGE_PATH =
  `${DASHBOARD_PATH}/roles/:roleId/edit` as const;

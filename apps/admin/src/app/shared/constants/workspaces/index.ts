import { DASHBOARD_PATH } from '../paths';

export const WORKSPACES_PAGE_PATH = `${DASHBOARD_PATH}/workspaces` as const;
export const WORKSPACE_PAGE_PATH = `${DASHBOARD_PATH}/workspaces/:id` as const;
export const WORKSPACE_EDIT_PAGE_PATH =
  `${DASHBOARD_PATH}/workspaces/:id/edit` as const;

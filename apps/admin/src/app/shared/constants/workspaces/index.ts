import { ADMIN_PATH } from '../paths';

export const WORKSPACES_PAGE_PATH = `${ADMIN_PATH}/workspaces` as const;
export const WORKSPACE_PAGE_PATH =
  `${ADMIN_PATH}/workspaces/:workspaceId` as const;
export const WORKSPACE_EDIT_PAGE_PATH =
  `${ADMIN_PATH}/workspaces/:workspaceId/edit` as const;

import { DASHBOARD_PATH } from '../paths';

export const SPACES_PAGE_PATH = `${DASHBOARD_PATH}/spaces` as const;
export const SPACE_PAGE_PATH =
  `${DASHBOARD_PATH}/spaces/:spaceId` as const;
export const SPACE_EDIT_PAGE_PATH =
  `${DASHBOARD_PATH}/spaces/:spaceId/edit` as const;
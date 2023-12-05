import { ADMIN_PATH } from '../paths';

export const SPACES_PAGE_PATH = `${ADMIN_PATH}/spaces` as const;
export const SPACE_PAGE_PATH =
  `${ADMIN_PATH}/spaces/:spaceId` as const;
export const SPACE_EDIT_PAGE_PATH =
  `${ADMIN_PATH}/spaces/:spaceId/edit` as const;
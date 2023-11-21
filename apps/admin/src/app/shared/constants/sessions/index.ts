import { DASHBOARD_PATH } from '../paths';

export const SESSIONS_PAGE_PATH = `${DASHBOARD_PATH}/sessions` as const;
export const SESSION_PAGE_PATH =
  `${DASHBOARD_PATH}/sessions/:sessionId` as const;
export const SESSION_EDIT_PAGE_PATH =
  `${DASHBOARD_PATH}/sessions/:sessionId/edit` as const;
import { DASHBOARD_PATH } from '../paths';

export const TIMELINES_PAGE_PATH =
  `${DASHBOARD_PATH}/sessions/:sessionId/timelines` as const;
export const TIMELINE_PAGE_PATH =
  `${DASHBOARD_PATH}/sessions/:sessionId/timelines/:timelineId` as const;
export const TIMELINE_EDIT_PAGE_PATH =
  `${DASHBOARD_PATH}/sessions/:sessionId/timelines/:timelineId/edit` as const;

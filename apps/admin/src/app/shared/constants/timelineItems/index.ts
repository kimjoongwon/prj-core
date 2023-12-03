import { DASHBOARD_PATH } from '../paths';

export const TIMELINEITEMS_PAGE_PATH =
  `${DASHBOARD_PATH}/sessions/:sessionId/timelines/:timelineId/timelineItems` as const;
export const TIMELINEITEM_PAGE_PATH =
  `${DASHBOARD_PATH}/sessions/:sessionId/timelines/:timelineId/timelineItems/:timelineItemId` as const;
export const TIMELINEITEM_EDIT_PAGE_PATH =
  `${DASHBOARD_PATH}/sessions/:sessionId/timelines/:timelineId/timelineItems/:timelineItemId/edit` as const;

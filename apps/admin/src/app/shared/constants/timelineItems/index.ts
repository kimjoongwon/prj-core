import { DASHBOARD_PATH } from '../paths';

export const TIMELINEITEMS_PAGE_PATH = `${DASHBOARD_PATH}/timelineItems` as const;
export const TIMELINEITEM_PAGE_PATH =
  `${DASHBOARD_PATH}/timelineItems/:timelineItemId` as const;
export const TIMELINEITEM_EDIT_PAGE_PATH =
  `${DASHBOARD_PATH}/timelineItems/:timelineItemId/edit` as const;
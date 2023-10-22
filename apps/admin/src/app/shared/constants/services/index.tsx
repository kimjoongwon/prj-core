import { DASHBOARD_PATH } from '../paths';

export const SERVICES_PAGE_PATH = `${DASHBOARD_PATH}/services` as const;
export const SERVICE_PAGE_PATH = `${DASHBOARD_PATH}/services/:id` as const;
export const SERVICE_EDIT_PAGE_PATH =
  `${DASHBOARD_PATH}/services/:id/edit` as const;

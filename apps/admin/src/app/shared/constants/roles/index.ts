import { ADMIN_PATH } from '../paths';

export const ROLES_PAGE_PATH = `${ADMIN_PATH}/roles`;
export const ROLE_PAGE_PATH = ROLES_PAGE_PATH + `/:roleId`;
export const ROLE_EDIT_PAGE_PATH = ROLE_PAGE_PATH + '/edit';

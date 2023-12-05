---
to: src/app/shared/constants/<%= h.inflection.pluralize(name) %>/index.ts
unless_exists: true
---
import { ADMIN_PATH } from '../paths';

export const <%= h.changeCase.upper(name) %>S_PAGE_PATH = `${ADMIN_PATH}/<%= name %>s` as const;
export const <%= h.changeCase.upper(name) %>_PAGE_PATH =
  `${ADMIN_PATH}/<%= name %>s/:<%= name %>Id` as const;
export const <%= h.changeCase.upper(name) %>_EDIT_PAGE_PATH =
  `${ADMIN_PATH}/<%= name %>s/:<%= name %>Id/edit` as const;
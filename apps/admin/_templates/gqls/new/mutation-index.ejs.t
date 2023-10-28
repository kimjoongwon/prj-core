---
to: src/app/shared/gqls/mutations/<%= name %>s/index.ts
---
export * from './CREATE_<%= h.inflection.singularize(name).toUpperCase() %>';
export * from './DELETE_<%= h.inflection.singularize(name).toUpperCase() %>';
export * from './UPDATE_<%= h.inflection.singularize(name).toUpperCase() %>';
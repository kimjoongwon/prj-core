---
to: src/app/shared/gqls/queries/<%= name %>s/index.ts
---

export * from './GET_<%= h.inflection.singularize(name).toUpperCase() %>';  
export * from './GET_<%= h.inflection.pluralize(name).toUpperCase() %>';
export * from './GET_<%= h.inflection.singularize(name).toUpperCase() %>_FORM';

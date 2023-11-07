---
to: src/app/shared/gqls/mutations/<%= name %>s/index.ts
---
export * from './useCreate<%= h.inflection.pluralize(name) %>';
export * from './useDelete<%= h.inflection.pluralize(name) %>';
export * from './useUpdate<%= h.inflection.pluralize(name) %>';
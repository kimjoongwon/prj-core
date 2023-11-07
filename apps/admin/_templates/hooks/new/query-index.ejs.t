---
to: src/app/shared/hooks/queries/<%= h.inflection.pluralize(name) %>/index.ts
---
export * from './use<%= Name %>FormQuery';
export * from './use<%= Name %>Query';
export * from './use<%= h.inflection.pluralize(Name) %>Query';
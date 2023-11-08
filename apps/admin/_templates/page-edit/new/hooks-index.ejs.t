---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/[<%= name %>Id]/edit/hooks/index.ts
---
export * from './useHandlers';
export * from './useState';
export * from './useMutations';
export * from './useQueries';
export * from './use<%= Name %>EditPage';
export * from './useSchemas';

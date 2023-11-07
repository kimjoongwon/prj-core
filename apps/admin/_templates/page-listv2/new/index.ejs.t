---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/hooks/index.ts
---

export * from './useMeta';
export * from './useQueries';
export * from './useState';
export * from './usePage';
export * from './useHandlers';

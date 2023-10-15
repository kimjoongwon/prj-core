---
to: src/app/admin/(dashboard)/<%= h.inflection.pluralize(name) %>/components/index.ts
unless_exists: true
---
export * from './PageProvider/PageProvider';
export * from './SearchFilters/SearchFilters';
export * from './Page/Page';
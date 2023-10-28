---
inject: true
append: true
to: src/app/shared/gqls/queries/index.ts
skip_if: <%= name %>
---
export * from './<%= name %>s';


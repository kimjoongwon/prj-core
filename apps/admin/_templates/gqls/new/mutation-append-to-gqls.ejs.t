---
inject: true
append: true
to: src/app/shared/gqls/mutations/index.ts
skip_if: <%= name %>
---

export * from './<%= name %>s';


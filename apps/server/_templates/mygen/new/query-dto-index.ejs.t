---
inject: true
to: src/shared/dtos/query/index.ts
append: true
---
export * from './<%= name %>-query.dto';
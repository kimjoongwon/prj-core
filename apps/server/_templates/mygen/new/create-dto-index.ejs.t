---
inject: true
to: src/shared/dtos/create/index.ts
append: true
---
export * from './create-<%= name %>.dto';
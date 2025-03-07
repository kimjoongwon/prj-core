---
inject: true
to: src/shared/dtos/update/index.ts
append: true
---
export * from './update-<%= name %>.dto';
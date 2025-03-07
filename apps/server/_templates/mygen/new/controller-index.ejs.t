---
inject: true
to: src/shared/controllers/index.ts
append: true
---
export * from './<%= h.inflection.pluralize(name) %>.controller';
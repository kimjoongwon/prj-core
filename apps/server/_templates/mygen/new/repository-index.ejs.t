---
inject: true
to: src/shared/repositories/index.ts
append: true
---
export * from './<%= h.inflection.pluralize(name) %>.repository';
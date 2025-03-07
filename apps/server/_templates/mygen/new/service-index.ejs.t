---
inject: true
to: src/shared/services/index.ts
append: true
---
export * from './<%= h.inflection.pluralize(name) %>.service';
---
to: src/app/shared/constants/index.ts
append: true
---
export * from './<%= h.inflection.pluralize(name) %>'

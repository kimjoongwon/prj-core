---
to: src/modules/<%= name %>s/models/<%= name %>-form.model.ts
---
import { ObjectType, IntersectionType } from '@nestjs/graphql';
import { Create<%= h.changeCase.pascal(name) %>Input } from '../dto/create-<%= name %>.input';

@ObjectType()
class AdditionalForm {}

@ObjectType()
export class <%= h.changeCase.pascal(name) %>Form extends IntersectionType(
  Create<%= h.changeCase.pascal(name) %>Input,
  AdditionalForm,
  ObjectType,
) {}

export const default<%= Name %>Form: <%= h.changeCase.pascal(name) %>Form = {
  name: '',
};

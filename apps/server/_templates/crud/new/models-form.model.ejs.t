---
to: src/modules/<%= name %>s/models/<%= name %>-form.model.ts
---
import { ObjectType, PartialType } from '@nestjs/graphql';
import { Create<%= h.changeCase.pascal(name) %>Input } from '../dto';

@ObjectType()
export class <%= h.changeCase.pascal(name) %>Form extends PartialType(
  Create<%= h.changeCase.pascal(name) %>Input,
  ObjectType,
) {}

export const <%= h.changeCase.camel(name) %>Form = {
  name: '',
};

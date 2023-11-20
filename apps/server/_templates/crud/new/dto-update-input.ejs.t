---
to: src/modules/<%= name %>s/dto/update-<%=name %>.input.ts
---

import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { <%= h.changeCase.pascal(name) %> } from '../models/<%= name %>.model';

@InputType()
export class Update<%= h.changeCase.pascal(name) %>Input extends PartialType(
  <%= h.changeCase.pascal(name) %>,
  InputType,
) {
  @Field(type => ID!, { nullable: true })
  id: string;
}

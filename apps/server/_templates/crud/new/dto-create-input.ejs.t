---
to: src/modules/<%= name %>s/dto/create-<%=name %>.input.ts
---


import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class Create<%= h.changeCase.pascal(name) %>Input {
  @Field(type => String)
  name: string;
}

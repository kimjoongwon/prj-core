---
to: src/modules/<%= name %>s/models/<%= name %>.model.ts
---
import { Base } from '@common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class <%= h.changeCase.pascal(name) %> extends Base {
  @Field(type => String)
  name: string;
}

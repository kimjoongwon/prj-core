---
to: src/modules/<%= name %>s/models/<%= name %>.model.ts
---
import { Base } from '../../../common/interfaces/base.interface';
import { Field, ObjectType } from '@nestjs/graphql';
import { <%= Name %> as CoC<%= Name %> } from '@coc/database';

@ObjectType()
export class <%= h.changeCase.pascal(name) %> extends Base implements CoC<%= h.changeCase.pascal(name) %> {
  @Field(type => String)
  name: string;
}

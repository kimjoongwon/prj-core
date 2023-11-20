---
to: src/modules/<%= name %>s/models/paginated-<%= name %>.model.ts
---
import { Paginated } from '../../../common/models/paginated.model';
import { ObjectType } from '@nestjs/graphql';
import { <%= h.changeCase.pascal(name) %> } from './<%= name %>.model';

@ObjectType()
export class Paginated<%= h.changeCase.pascal(name) %> extends Paginated(<%= h.changeCase.pascal(name) %>) {}

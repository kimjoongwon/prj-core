---
to: src/modules/<%= name %>s/dto/create-<%=name %>.input.ts
---


import { InputType, OmitType } from '@nestjs/graphql';
import { BASE_FIELDS } from '../../../common/constants';
import { <%= Name %> } from '../models/<%= name %>.model';

@InputType()
export class Create<%= h.changeCase.pascal(name) %>Input extends OmitType(
  <%= h.changeCase.pascal(name) %>,
  [...BASE_FIELDS],
  InputType,
) {}

---
to: src/shared/dtos/create/create-<%= name %>.dto.ts
---
import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants';
import { <%= h.changeCase.pascal(name) %>Dto } from '../<%= name %>.dto';

export class Create<%= h.changeCase.pascal(name) %>Dto extends OmitType(<%= h.changeCase.pascal(name) %>Dto, [...COMMON_ENTITY_FIELDS]) {}

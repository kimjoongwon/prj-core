---
to: src/shared/dtos/<%= name %>.dto.ts
---
import { <%= h.changeCase.pascal(name) %> as <%= h.changeCase.pascal(name) %>Entity } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { StringField, UUIDField } from '../decorators';

export class <%= h.changeCase.pascal(name) %>Dto extends AbstractDto implements <%= h.changeCase.pascal(name) %>Entity {}

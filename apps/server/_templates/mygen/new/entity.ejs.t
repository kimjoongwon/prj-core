---
to: src/shared/entities/<%= name %>.entity.ts
---
import { <%= h.changeCase.pascal(name) %> as <%= h.changeCase.pascal(name) %>Entity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { <%= h.changeCase.pascal(name) %>Dto } from '../dtos/<%= name %>.dto';
import { UseDto } from '../decorators/use-dto.decorator';

@UseDto(<%= h.changeCase.pascal(name) %>Dto)
export class <%= h.changeCase.pascal(name) %> extends AbstractEntity<<%= h.changeCase.pascal(name) %>Dto> implements <%= h.changeCase.pascal(name) %>Entity {}

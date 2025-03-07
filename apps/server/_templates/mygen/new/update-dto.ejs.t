---
to: src/shared/dtos/update/update-<%= name %>.dto.ts
---

import { PartialType } from '@nestjs/swagger';
import { Create<%= h.changeCase.pascal(name) %>Dto } from '../create';

export class Update<%= h.changeCase.pascal(name) %>Dto extends PartialType(Create<%= h.changeCase.pascal(name) %>Dto) {}
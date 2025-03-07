---
to: src/shared/dtos/query/<%= name %>-query.dto.ts
---

import { QueryDto } from './query.dto';

export class <%= h.changeCase.pascal(name) %>QueryDto extends QueryDto {}

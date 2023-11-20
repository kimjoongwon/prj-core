---
to: src/modules/<%= name %>s/dto/get-<%=name %>s.args.ts
---

import { QueryArgs } from '../../../common/dto/query.args';
import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class Get<%= h.changeCase.pascal(name) %>sArgs extends QueryArgs {}

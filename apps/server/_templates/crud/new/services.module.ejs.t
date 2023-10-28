---
to: src/modules/<%= name %>s/<%= name %>s.module.ts
---
import { Module } from '@nestjs/common';
import { <%= h.changeCase.pascal(name) %>sService } from './<%= name %>s.service';
import { <%= h.changeCase.pascal(name) %>sResolver } from './<%= name %>s.resolver';

@Module({
  providers: [<%= h.changeCase.pascal(name) %>sResolver, <%= h.changeCase.pascal(name) %>sService],
})
export class <%= h.changeCase.pascal(name) %>sModule {}

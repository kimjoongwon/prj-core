---
to: src/gateway/<%= h.inflection.pluralize(name) %>/<%= name %>-endpoint.module.ts
---

import { Module } from '@nestjs/common';
import { <%= h.inflection.pluralize(h.changeCase.pascal(name)) %>Controller, <%= h.inflection.pluralize(h.changeCase.pascal(name)) %>Repository, <%= h.inflection.pluralize(h.changeCase.pascal(name)) %>Service } from '@shared';

@Module({
  providers: [<%= h.inflection.pluralize(h.changeCase.pascal(name)) %>Service, <%= h.inflection.pluralize(h.changeCase.pascal(name)) %>Repository],
  controllers: [<%= h.inflection.pluralize(h.changeCase.pascal(name)) %>Controller],
})
export class <%= h.inflection.pluralize(h.changeCase.pascal(name)) %>EndpointModule {}

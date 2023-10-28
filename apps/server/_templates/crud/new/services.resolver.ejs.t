---
to: src/modules/<%= name %>s/<%= name %>s.resolver.ts
---
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, Public } from '@common';
import { <%= h.changeCase.pascal(name) %>sService } from './<%= name %>s.service';
import { Paginated<%= h.changeCase.pascal(name) %>, <%= h.changeCase.pascal(name) %>, <%= h.changeCase.pascal(name) %>Form } from './models';
import { Create<%= h.changeCase.pascal(name) %>Input, Get<%= h.changeCase.pascal(name) %>sArgs, Update<%= h.changeCase.pascal(name) %>Input } from './dto';

@Resolver(() => <%= h.changeCase.pascal(name) %>)
@UseGuards(GqlAuthGuard)
export class <%= h.changeCase.pascal(name) %>sResolver {
  constructor(private readonly <%= h.changeCase.camel(name) %>sService: <%= h.changeCase.pascal(name) %>sService) {}

  @Public()
  @Mutation(() => <%= h.changeCase.pascal(name) %>)
  create<%= h.changeCase.pascal(name) %>(
    @Args('create<%= h.changeCase.pascal(name) %>Input')
    create<%= h.changeCase.pascal(name) %>Input: Create<%= h.changeCase.pascal(name) %>Input,
  ) {
    return this.<%= h.changeCase.camel(name) %>sService.create(create<%= h.changeCase.pascal(name) %>Input);
  }

  @Public()
  @Mutation(() => <%= h.changeCase.pascal(name) %>)
  update<%= h.changeCase.pascal(name) %>(
    @Args('update<%= h.changeCase.pascal(name) %>Input')
    update<%= h.changeCase.pascal(name) %>Input: Update<%= h.changeCase.pascal(name) %>Input,
  ) {
    return this.<%= h.changeCase.camel(name) %>sService.update(update<%= h.changeCase.pascal(name) %>Input);
  }

  @Public()
  @Mutation(() => <%= h.changeCase.pascal(name) %>)
  delete<%= h.changeCase.pascal(name) %>(@Args('id') id: string) {
    return this.<%= h.changeCase.camel(name) %>sService.delete(id);
  }

  @Public()
  @Query(() => <%= h.changeCase.pascal(name) %>, { name: '<%= h.changeCase.snake(name) %>' })
  get<%= h.changeCase.pascal(name) %>(@Args('id') id: string) {
    return this.<%= h.changeCase.camel(name) %>sService.findOne(id);
  }

  @Public()
  @Query(() => <%= h.changeCase.pascal(name) %>Form, { name: '<%= h.changeCase.snake(name) %>Form' })
  get<%= h.changeCase.pascal(name) %>Form() {
    return this.<%= h.changeCase.camel(name) %>sService.findForm();
  }

  @Public()
  @Query(() => Paginated<%= h.changeCase.pascal(name) %>, { name: '<%= h.changeCase.snake(name) %>s' })
  get<%= h.changeCase.pascal(name) %>s(@Args() args: Get<%= h.changeCase.pascal(name) %>sArgs) {
    return this.<%= h.changeCase.camel(name) %>sService.findPaginated<%= h.changeCase.pascal(name) %>(args);
  }
}

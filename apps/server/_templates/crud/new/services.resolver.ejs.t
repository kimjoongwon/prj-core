---
to: src/modules/<%= name %>s/<%= name %>s.resolver.ts
---
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { <%= h.changeCase.pascal(name) %>sService } from './<%= name %>s.service';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Get<%= h.changeCase.pascal(name) %>sArgs } from './dto/get-<%= h.changeCase.snake(name) %>s.args';
import { Create<%= h.changeCase.pascal(name) %>Input } from './dto/create-<%= h.changeCase.snake(name) %>.input';
import { Update<%= h.changeCase.pascal(name) %>Input } from './dto/update-<%= h.changeCase.snake(name) %>.input';
import { Paginated<%= h.changeCase.pascal(name) %> } from './models/paginated-<%= h.changeCase.snake(name) %>.model';
import { <%= Name %>Form } from './models/<%= h.changeCase.snake(name) %>-form.model';
import { <%= h.changeCase.pascal(name) %> } from './models/<%= h.changeCase.snake(name) %>.model';

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

import { Type } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

/**
 * @deprecated
 */
export function BaseResolver<T extends Type<unknown>>(classRef: T): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    constructor(private readonly service) {}

    @Query(() => [classRef], { name: `findAll${classRef.name}` })
    async findAll() {}

    async findUnique() {
      return this.service;
    }
  }
  return BaseResolverHost;
}

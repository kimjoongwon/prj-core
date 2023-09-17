import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export interface OffsetIEdgeType<T> {
  node: T;
}

export interface OffsetPageInfo {
  hasNextPage: boolean;
}

export interface OffsetIPaginatedType<T> {
  edges: OffsetIEdgeType<T>[];
  nodes: T[];
  totalCount: number;
  pageInfo: OffsetPageInfo;
}

export function OffsetPaginated<T>(
  classRef: Type<T>,
): Type<OffsetIPaginatedType<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(type => classRef)
    node: T;
  }

  @ObjectType('PageInfo')
  abstract class PageInfo {
    @Field(type => Boolean)
    hasNextPage: boolean;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements OffsetIPaginatedType<T> {
    @Field(type => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(type => [classRef], { nullable: true })
    nodes: T[];

    @Field(type => Int)
    totalCount: number;

    @Field(() => PageInfo, { nullable: true })
    pageInfo: PageInfo;
  }
  return PaginatedType as Type<OffsetIPaginatedType<T>>;
}

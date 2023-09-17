import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export interface IEdgeType<T> {
  cursor: string;
  node: T;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface IPaginatedType<T> {
  edges: IEdgeType<T>[];
  nodes: T[];
  totalCount: number;
  pageInfo: PageInfo;
}

export function CursorPaginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(type => String)
    cursor: string;

    @Field(type => classRef)
    node: T;
  }

  @ObjectType('PageInfo')
  abstract class PageInfo {
    @Field(type => Boolean)
    hasNextPage: boolean;

    @Field(type => String)
    endCursor: string;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(type => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(type => [classRef], { nullable: true })
    nodes: T[];

    @Field(type => Int)
    totalCount: number;

    @Field(() => PageInfo, { nullable: true })
    pageInfo: PageInfo;
  }
  return PaginatedType as Type<IPaginatedType<T>>;
}

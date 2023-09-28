import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export interface IEdgeType<T> {
  cursor?: string;
  node: T;
}

export interface PageInfo {
  totalCount: number;
  hasNextPage: boolean;
  endCursor?: string;
}

export interface IPaginatedType<T> {
  edges: IEdgeType<T>[];
  nodes: T[];
  pageInfo: PageInfo;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(type => String)
    cursor: string;

    @Field(type => classRef)
    node: T;
  }

  @ObjectType(`${classRef.name}PageInfo`)
  abstract class PageInfo {
    @Field(type => Boolean)
    hasNextPage: boolean;

    @Field(type => Int)
    totalCount: number;

    @Field(type => String)
    endCursor: string;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(type => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(type => [classRef], { nullable: true })
    nodes: T[];

    @Field(() => PageInfo, { nullable: true })
    pageInfo: PageInfo;
  }
  return PaginatedType as Type<IPaginatedType<T>>;
}

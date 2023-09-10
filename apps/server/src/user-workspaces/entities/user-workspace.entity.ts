import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserWorkspace {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

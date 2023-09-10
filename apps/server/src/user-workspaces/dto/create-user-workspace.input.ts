import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserWorkspaceInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

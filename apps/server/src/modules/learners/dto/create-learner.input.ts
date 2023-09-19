import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLearnerInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

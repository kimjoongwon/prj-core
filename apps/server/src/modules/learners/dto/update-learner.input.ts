import { CreateLearnerInput } from './create-learner.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLearnerInput extends PartialType(CreateLearnerInput) {
  @Field(() => Int)
  id: number;
}

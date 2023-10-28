import { Field, InputType, PartialType } from '@nestjs/graphql';
import { TestTest } from '../models/test-test.model';

@InputType()
export class UpdateTestTestInput extends PartialType(TestTest, InputType) {
  @Field(type => String, { nullable: true })
  id: string;
}

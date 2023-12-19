import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { Service } from '../models/service.model';

@InputType()
export class UpdateServiceInput extends PartialType(Service, InputType) {
  @Field(type => ID!)
  id: string;
}

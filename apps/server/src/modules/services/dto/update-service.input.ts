import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Service } from '../models/service.model';

@InputType()
export class UpdateServiceInput extends PartialType(Service, InputType) {
  @Field(type => String, { nullable: true })
  id: string;
}

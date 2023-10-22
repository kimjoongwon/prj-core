import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Service } from '../model/service.entity';

@InputType()
export class UpdateServiceInput extends PartialType(Service, InputType) {
  @Field(type => String, { nullable: true })
  id: string;
}

import { Field, InputType, PartialType } from '@nestjs/graphql';
import { UserService } from '../models/user-service.model';

@InputType()
export class UpdateUserServiceInput extends PartialType(
  UserService,
  InputType,
) {
  @Field(type => String, { nullable: true })
  id: string;
}

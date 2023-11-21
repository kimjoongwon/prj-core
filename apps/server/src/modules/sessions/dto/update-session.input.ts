import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { Session } from '../models/session.model';

@InputType()
export class UpdateSessionInput extends PartialType(Session, InputType) {
  @Field(type => ID!, { nullable: true })
  id: string;
}

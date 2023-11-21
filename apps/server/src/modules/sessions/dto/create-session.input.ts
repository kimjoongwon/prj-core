import { Field, InputType, OmitType } from '@nestjs/graphql';
import { BASE_FIELDS } from '../../../common/constants';
import { Session } from '../models/session.model';

@InputType()
export class CreateSessionInput extends OmitType(
  Session,
  [...BASE_FIELDS, 'tilelines'],
  InputType,
) {
  @Field(type => [String])
  timelineIds: string[];
}

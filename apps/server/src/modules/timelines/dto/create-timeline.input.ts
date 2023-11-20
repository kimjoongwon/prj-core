import { InputType, OmitType } from '@nestjs/graphql';
import { BASE_FIELDS } from '../../../common/constants';
import { Timeline } from '../models/timeline.model';

@InputType()
export class CreateTimelineInput extends OmitType(
  Timeline,
  [...BASE_FIELDS],
  InputType,
) {}

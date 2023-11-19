import { Field, InputType, OmitType } from '@nestjs/graphql';
import { Service } from '../models/service.model';
import { BASE_FIELDS } from '../../../common/constants';

@InputType()
export class CreateServiceInput extends OmitType(
  Service,
  BASE_FIELDS,
  InputType,
) {}

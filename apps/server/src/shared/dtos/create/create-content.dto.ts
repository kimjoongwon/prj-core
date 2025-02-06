import { OmitType } from '@nestjs/swagger';
import { ContentDto } from '../content.dto';
import { COMMON_ENTITY_FIELDS } from '../../constants';
import { CreateDepotDto } from './create-depot.dto';
import { ClassField } from '../../decorators/field.decorators';

export class CreateContentDto extends OmitType(ContentDto, [...COMMON_ENTITY_FIELDS, 'dopotId']) {
  @ClassField(() => CreateDepotDto)
  depot: CreateDepotDto;
}

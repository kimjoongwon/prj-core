import { OmitType } from '@nestjs/swagger';
import { EmailDto } from './email.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreateEmailDto extends OmitType(EmailDto, [...COMMON_ENTITY_FIELDS]) {}

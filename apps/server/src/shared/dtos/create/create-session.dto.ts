import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants';
import { SessionDto } from '../session.dto';

export class CreateSessionDto extends OmitType(SessionDto, [...COMMON_ENTITY_FIELDS]) {}

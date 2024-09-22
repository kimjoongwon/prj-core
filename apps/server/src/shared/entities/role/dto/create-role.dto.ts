import { OmitType } from '@nestjs/swagger';
import { StringField } from '../../../decorators';
import { RoleDto } from './role.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants';

export class CreateRoleDto extends OmitType(RoleDto, [...COMMON_ENTITY_FIELDS, 'tenant']) {}

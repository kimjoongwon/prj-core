import { OmitType } from '@nestjs/swagger';
import { RoleDto } from '../role.dto';
import { COMMON_ENTITY_FIELDS } from '../../constants';
import { UUIDField } from '../../decorators';

export class CreateRoleDto extends OmitType(RoleDto, [...COMMON_ENTITY_FIELDS, 'tenant']) {
  @UUIDField()
  serviceId: string;

  @UUIDField()
  categoryId: string;
}

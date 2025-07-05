import { OmitType } from '@nestjs/swagger';
import { RoleDto } from '../role.dto';
import { COMMON_ENTITY_FIELDS } from '../../constant';
import { UUIDField } from '../../decorator';

export class CreateRoleDto extends OmitType(RoleDto, [...COMMON_ENTITY_FIELDS]) {
  @UUIDField()
  serviceId: string;

  @UUIDField()
  categoryId: string;
}

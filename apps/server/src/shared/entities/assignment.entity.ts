import { Assignment as AssignmentEntity, Role, Tenant } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { AssignmentDto } from '../dtos/assignment.dto';
import { UseDto } from '../decorators/use-dto.decorator';

@UseDto(AssignmentDto)
export class Assignment extends AbstractEntity<AssignmentDto> implements AssignmentEntity {
  roleId: string;
  tenantId: string;

  role?: Role;
  tenant?: Tenant;
}

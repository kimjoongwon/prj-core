// import { $Enums } from '@prisma/client';
// import { ClassField, EnumField, UUIDField } from '../decorators/field.decorators';
// import { AbstractDto } from './abstract.dto';
// import { TenantDto } from './tenant.dto';
// import { Role } from '../entities/role.entity';

// export class RoleDto extends AbstractDto implements Role {
//   @EnumField(() => $Enums.Roles)
//   name: $Enums.Roles;

//   @UUIDField()
//   classificationId: string;

//   @ClassField(() => TenantDto, { required: false })
//   tenant?: TenantDto;
// }

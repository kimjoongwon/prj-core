import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiEndpoints } from '../../../shared/types/enums/api-endpoints';

@ApiTags('ADMIN_ROLES')
@Controller(ApiEndpoints.ADMIN_ROLES)
export class RolesController {}

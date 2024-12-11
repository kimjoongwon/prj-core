import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ADMIN_ROLES')
@Controller()
export class RolesController {}

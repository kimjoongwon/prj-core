import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ADMIN_GROUPS')
@Controller()
export class AdminGroupsController {
  constructor() {}
}

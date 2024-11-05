import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ADMIN_PAGES')
@Controller()
export class AdminPagesController {
  constructor() {}
}

import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Public } from '@shared/backend';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ADMIN_PATH } from './constants';
import { MenuDto } from './dto';

@ApiTags(ADMIN_PATH)
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Public()
  @Get('menus')
  @ApiResponse({
    status: 200,
    description: 'Get admin menus',
    type: [MenuDto],
  })
  getMemus() {
    return this.adminService.getMenus();
  }
}

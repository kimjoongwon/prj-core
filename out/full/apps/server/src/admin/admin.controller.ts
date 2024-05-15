import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Public } from '@shared/backend';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MenuDto } from './dto';
import { ADMIN_SERVICE_URLS } from './constants';

@ApiTags('admin')
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Public()
  @Get(ADMIN_SERVICE_URLS.ADMIN_MENUS)
  @ApiResponse({
    status: 200,
    description: 'Get admin menus',
    type: [MenuDto],
  })
  getMemus() {
    return this.adminService.getMenus();
  }
}

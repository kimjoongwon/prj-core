import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('SERVICE_AUTH')
@Controller()
export class ServiceAuthController {
  @Get()
  async test() {
    return 'ServiceAuthController';
  }
}

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, ResponseEntity } from '@shared';
import { AppBuilderService } from './app-builder.service';

@ApiTags('BUILDER')
@Controller()
export class AppBuilderController {
  constructor(private readonly appBuilderService: AppBuilderService) {}
  @Get()
  @Auth([], { public: true })
  async getAppBuilder() {
    const app = await this.appBuilderService.build();
    return new ResponseEntity(200, '성공', app);
  }
}

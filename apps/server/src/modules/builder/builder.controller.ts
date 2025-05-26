import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, BuilderService, ResponseEntity } from '@shared';

@ApiTags('BUILDER')
@Controller()
export class BuilderController {
  constructor(private readonly builderService: BuilderService) {}
  @Get()
  @Auth([], { public: true })
  async getAppBuilder() {
    const app = await this.builderService.build();
    return new ResponseEntity(200, '성공', app);
  }
}

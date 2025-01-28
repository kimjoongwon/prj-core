import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, BuilderService, ResponseEntity } from '@shared';

@ApiTags('BUILDER')
@Controller()
export class BuilderEndpoint {
  constructor(private readonly builderService: BuilderService) {}
  @Get()
  @Auth([], { public: true })
  async getAppBuilder() {
    const pages = await this.builderService.getRoute();
    return new ResponseEntity(200, '성공', pages);
  }
}

import { Body, Controller, Get, Post, Res, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, ResponseEntity } from '@shared';
import { AppBuilderService } from './app-builder.service';
import { Response, Request } from 'express';
import { SelectTenantDto } from './dto/select-tenant.dto';

@ApiTags('BUILDER')
@Controller()
export class AppBuilderController {
  constructor(private readonly appBuilderService: AppBuilderService) {}

  @Get()
  @Auth([], { public: true })
  async getAppBuilder(@Req() req: Request) {
    // 인증 상태 확인 (accessToken 쿠키 존재 여부로 판단)
    const isAuthenticated = !!req.cookies?.accessToken;
    const app = await this.appBuilderService.build(isAuthenticated);
    return new ResponseEntity(200, '성공', app);
  }

  @Post('select-tenant')
  async selectTenant(
    @Body() selectTenantDto: SelectTenantDto,
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    console.log('selectTenantDto', selectTenantDto);
    res.cookie('tenantId', selectTenantDto.selectedTenantId, {
      httpOnly: true,
    });
    return new ResponseEntity(200, '성공');
  }
}

import { Body, Controller, Get, Post, Res, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, ResponseEntity } from '@shared';
import { AppBuilderService } from './app-builder.service';
import { Response, Request } from 'express';
import { SelectTenantDto } from './dto/select-tenant.dto';

// 응답 메시지 상수
const RESPONSE_MESSAGES = {
  SUCCESS: '성공',
} as const;

// 쿠키 설정 상수
const COOKIE_CONFIG = {
  TENANT_ID: {
    name: 'tenantId',
    options: {
      httpOnly: true,
    },
  },
  ACCESS_TOKEN: 'accessToken',
} as const;

@ApiTags('BUILDER')
@Controller()
export class AppBuilderController {
  constructor(private readonly appBuilderService: AppBuilderService) {}

  @Get()
  @Auth([], { public: true })
  async getAppBuilder(@Req() req: Request) {
    const isAuthenticated = this.checkAuthenticationStatus(req);
    const app = await this.appBuilderService.build(isAuthenticated);
    return new ResponseEntity(200, RESPONSE_MESSAGES.SUCCESS, app);
  }

  @Post('select-tenant')
  async selectTenant(
    @Body() selectTenantDto: SelectTenantDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.setTenantCookie(res, selectTenantDto.selectedTenantId);
    return new ResponseEntity(200, RESPONSE_MESSAGES.SUCCESS);
  }

  /**
   * 인증 상태 확인 (accessToken 쿠키 존재 여부로 판단)
   */
  private checkAuthenticationStatus(req: Request): boolean {
    return !!req.cookies?.[COOKIE_CONFIG.ACCESS_TOKEN];
  }

  /**
   * 테넌트 쿠키 설정
   */
  private setTenantCookie(res: Response, tenantId: string): void {
    res.cookie(COOKIE_CONFIG.TENANT_ID.name, tenantId, COOKIE_CONFIG.TENANT_ID.options);
  }
}

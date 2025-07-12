import { Body, Controller, Get, Logger, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@shared';
import { ResponseEntity, SelectTenantDto } from '@shared/schema';
import { Request, Response } from 'express';
import { AppBuilderService } from '../service/app-builder.service';

// 응답 메시지 상수
const RESPONSE_MESSAGES = {
  SUCCESS: '성공',
} as const;

// 쿠키 설정 상수
const COOKIE_CONFIG = {
  TENANT_ID: {
    name: 'tenantId',
    options: {},
  },
  ACCESS_TOKEN: 'accessToken',
} as const;

@ApiTags('BUILDER')
@Controller()
export class AppBuilderController {
  private readonly logger = new Logger(AppBuilderController.name);
  constructor(private readonly appBuilderService: AppBuilderService) { }

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
    @Res({ passthrough: true }) res: Response
  ) {
    this.logger.log('테넌트 선택 요청:', selectTenantDto);
    if (!selectTenantDto.selectedTenantId) {
      this.logger.warn('선택된 테넌트 ID가 없습니다.');
      return new ResponseEntity(400, '테넌트를 선택해주세요.');
    }
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

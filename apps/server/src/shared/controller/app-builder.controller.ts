import { Body, Controller, Get, Logger, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppBuilderDto, ResponseEntity, type SelectTenantDto } from "@shared/schema";
import { Request, Response } from "express";
import { Auth } from "../decorator/auth.decorator";
import { AppBuilderService } from "../service/app-builder.service";
import { ApiResponseEntity } from "../decorator";

// 응답 메시지 상수
const RESPONSE_MESSAGES = {
  SUCCESS: "성공",
} as const;

// 쿠키 설정 상수
const COOKIE_CONFIG = {
  TENANT_ID: {
    name: "tenantId",
    options: {},
  },
  ACCESS_TOKEN: "accessToken",
} as const;

@ApiTags("BUILDER")
@Controller()
export class AppBuilderController {
  private readonly logger = new Logger(AppBuilderController.name);
  constructor(private readonly appBuilderService: AppBuilderService) {}

  @Get()
  @Auth([], { public: true })
  @ApiResponseEntity(AppBuilderDto, 200)
  async getAppBuilder(@Req() req: Request) {
    const isAuthenticated = this.checkAuthenticationStatus(req);
    const app = await this.appBuilderService.build(isAuthenticated);
    return new ResponseEntity(200, RESPONSE_MESSAGES.SUCCESS, app);
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

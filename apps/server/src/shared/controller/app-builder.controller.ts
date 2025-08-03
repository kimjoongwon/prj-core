import { Controller, Get, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppBuilderDto, ResponseEntity } from "@shared/schema";
import { Request } from "express";
import { ApiResponseEntity } from "../decorator";
import { Auth } from "../decorator/auth.decorator";
import { AppBuilderService } from "../service/app-builder.service";

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
	constructor(private readonly appBuilderService: AppBuilderService) {}

	@Get()
	@Auth({ public: true, injectTenant: false })
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
}

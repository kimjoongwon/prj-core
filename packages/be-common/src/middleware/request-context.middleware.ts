import { CONTEXT_KEYS, REQUEST_HEADER_KEYS } from "@cocrepo/constant";
import { UserDto } from "@cocrepo/dto";
import { parseAcceptLanguage } from "@cocrepo/toolkit";
import { Injectable, type NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { ClsService } from "nestjs-cls";
import { AppLogger } from "../util/app-logger.util";
import {
	resolveCurrentTenantById,
	resolveTenantSpaceId,
} from "../util/permission.util";

/**
 * CLS 컨텍스트를 설정하는 Middleware
 *
 * Guard 이전에 실행되어, Guard에서 CLS를 통해 user/tenant 정보에 접근 가능
 * AuthMiddleware가 먼저 실행되어 request.user가 설정된 상태에서 동작
 *
 * 최소 정보만 저장: AUTH_USER, USER_ID, TENANT_ID, TENANT, SPACE_ID, LANGUAGE
 * 접근 제어 로직은 SpaceScopeInterceptor에서 처리
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
	private readonly logger = new AppLogger(RequestContextMiddleware.name);

	constructor(private readonly cls: ClsService) {}

	use(req: Request, _res: Response, next: NextFunction) {
		try {
			this.setRequestContext(req);
		} catch (error) {
			this.logger.error(
				`Request 컨텍스트 설정 실패: ${error instanceof Error ? error?.message : String(error)}`,
			);

			// 예상치 못한 에러가 발생해도 기본값으로 설정하여 요청이 계속 진행되도록 함
			this.cls.set(CONTEXT_KEYS.AUTH_USER, undefined);
			this.cls.set(CONTEXT_KEYS.USER_ID, undefined);
			this.cls.set(CONTEXT_KEYS.TENANT_ID, undefined);
			this.cls.set(CONTEXT_KEYS.SPACE_ID, undefined);
			this.cls.set(CONTEXT_KEYS.TENANT, undefined);
		}

		next();
	}

	private setRequestContext(request: Request): void {
		const user = request.user as UserDto;

		// User 설정
		if (user) {
			this.cls.set(CONTEXT_KEYS.AUTH_USER, user);
			this.cls.set(CONTEXT_KEYS.USER_ID, user.id);
		} else {
			this.cls.set(CONTEXT_KEYS.AUTH_USER, undefined);
			this.cls.set(CONTEXT_KEYS.USER_ID, undefined);
		}

		// 언어 설정 (Accept-Language 또는 x-language 헤더)
		const languageFromHeader =
			this.readRequestHeader(request, REQUEST_HEADER_KEYS.LANGUAGE) ||
			(request.headers["accept-language"] as string | undefined);

		const language = parseAcceptLanguage(languageFromHeader);
		this.cls.set(CONTEXT_KEYS.LANGUAGE, language);

		// Tenant ID 설정 (x-tenant-id 헤더)
		const tenantId = this.readRequestHeader(
			request,
			REQUEST_HEADER_KEYS.TENANT_ID,
		);
		this.cls.set(CONTEXT_KEYS.TENANT_ID, tenantId || undefined);

		// Tenant 설정 및 Space ID 파생
		const tenant = resolveCurrentTenantById(user?.tenants, tenantId);
		const spaceId = tenant ? resolveTenantSpaceId(tenant) : undefined;
		this.cls.set(CONTEXT_KEYS.TENANT, tenant);
		this.cls.set(CONTEXT_KEYS.SPACE_ID, spaceId);

		if (user && tenant) {
			this.logger.dev("Request 컨텍스트 설정 완료", {
				userId: user.id.slice(-8),
				requestedTenantId: tenantId?.slice(-8),
				tenantId: tenant.id.slice(-8),
				spaceId: spaceId?.slice(-8),
				language,
			});
		}
	}

	private readRequestHeader(
		request: Request,
		headerName: string,
	): string | undefined {
		const headerValue = request.headers[headerName];
		if (typeof headerValue === "string") {
			return headerValue;
		}

		return Array.isArray(headerValue) ? headerValue[0] : undefined;
	}
}

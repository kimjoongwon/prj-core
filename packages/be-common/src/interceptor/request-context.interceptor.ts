import { CONTEXT_KEYS } from "@cocrepo/constant";
import { TenantDto, UserDto } from "@cocrepo/dto";
import {
	BadRequestException,
	type CallHandler,
	type ExecutionContext,
	ForbiddenException,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import { Request } from "express";
import { ClsService } from "nestjs-cls";
import { Observable } from "rxjs";
import { parseAcceptLanguage } from "@cocrepo/be-i18n";
import { AppLogger } from "../util/app-logger.util";

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
	private readonly logger = new AppLogger(RequestContextInterceptor.name);

	constructor(private readonly cls: ClsService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest<Request>();

		this.setRequestContext(request);

		return next.handle();
	}

	private setRequestContext(request: Request): void {
		try {
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
				(request.headers["x-language"] as string | undefined) ||
				(request.headers["accept-language"] as string | undefined);

			const language = parseAcceptLanguage(languageFromHeader);
			this.cls.set(CONTEXT_KEYS.LANGUAGE, language);

			// Space ID 설정 (X-Space-ID 헤더 필수)
			// 모든 인증된 사용자는 x-space-id 헤더를 포함해야 함
			// SUPER_ADMIN도 System Space (isSystem=true)의 spaceId를 사용해야 함
			const spaceIdFromHeader = request.headers["x-space-id"] as
				| string
				| undefined;

			// x-space-id 헤더가 없는 경우 에러
			if (!spaceIdFromHeader && user) {
				throw new BadRequestException(
					"X-Space-ID 헤더가 필요합니다. Space를 선택해주세요.",
				);
			}

			// SPACE_ID 컨텍스트 설정
			this.cls.set(CONTEXT_KEYS.SPACE_ID, spaceIdFromHeader || undefined);

			// Tenant 설정 (spaceId가 있는 경우에만)
			if (
				!spaceIdFromHeader ||
				!user?.tenants ||
				!Array.isArray(user.tenants)
			) {
				this.cls.set(CONTEXT_KEYS.TENANT, undefined);
				return;
			}

			// spaceId로 해당 tenant 찾기
			const tenant = user.tenants.find(
				(t: TenantDto) => t.spaceId === spaceIdFromHeader,
			);

			if (!tenant) {
				throw new ForbiddenException(
					"해당 Space에 대한 접근 권한이 없습니다.",
				);
			}

			// Tenant 설정
			this.cls.set(CONTEXT_KEYS.TENANT, tenant);

			this.logger.dev("Request 컨텍스트 설정 완료", {
				userId: user.id,
				spaceId: spaceIdFromHeader.slice(-8),
				tenantId: tenant.id.slice(-8),
				language,
			});
		} catch (error) {
			// 의도적으로 발생시킨 HTTP 예외는 다시 throw
			if (
				error instanceof BadRequestException ||
				error instanceof ForbiddenException
			) {
				throw error;
			}

			this.logger.error(
				`Request 컨텍스트 설정 실패: ${error instanceof Error ? error?.message : String(error)}`,
			);

			// 예상치 못한 에러가 발생해도 기본값으로 설정하여 요청이 계속 진행되도록 함
			this.cls.set(CONTEXT_KEYS.AUTH_USER, undefined);
			this.cls.set(CONTEXT_KEYS.USER_ID, undefined);
			this.cls.set(CONTEXT_KEYS.TENANT, undefined);
		}
	}
}

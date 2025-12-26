import { CONTEXT_KEYS } from "@cocrepo/constant";
import { type TenantDto, type UserDto } from "@cocrepo/dto";
import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import { type Request } from "express";
import { ClsService } from "nestjs-cls";
import { type Observable } from "rxjs";
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

			// Tenant 설정
			const spaceIdFromHeader = request.headers["x-space-id"] as string;

			// X-Space-ID 헤더가 없거나 사용자 정보가 없으면 tenant를 undefined로 설정
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
				// 권한이 없어도 에러를 발생시키지 않고 undefined로 설정
				this.logger.warn("Space 접근 권한 없음", {
					spaceId: spaceIdFromHeader.slice(-8),
					userId: user.id,
				});

				this.cls.set(CONTEXT_KEYS.TENANT, undefined);
				return;
			}

			// Tenant 설정
			this.cls.set(CONTEXT_KEYS.TENANT, tenant);

			this.logger.dev("Request 컨텍스트 설정 완료", {
				userId: user.id,
				spaceId: spaceIdFromHeader.slice(-8),
				tenantId: tenant.id.slice(-8),
			});
		} catch (error) {
			this.logger.error(
				`Request 컨텍스트 설정 실패: ${error instanceof Error ? error?.message : String(error)}`,
			);

			// 에러가 발생해도 기본값으로 설정하여 요청이 계속 진행되도록 함
			this.cls.set(CONTEXT_KEYS.AUTH_USER, undefined);
			this.cls.set(CONTEXT_KEYS.USER_ID, undefined);
			this.cls.set(CONTEXT_KEYS.TENANT, undefined);
		}
	}
}

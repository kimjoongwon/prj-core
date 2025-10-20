import { type TenantDto, type UserDto } from "@cocrepo/schema";
import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import { type Request } from "express";
import { type Observable } from "rxjs";
import { ContextService } from "../service/context.service";
import { AppLogger } from "../util/app-logger.util";

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
	private readonly logger = new AppLogger(RequestContextInterceptor.name);

	constructor(private readonly contextService: ContextService) {}

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
				this.contextService.setAuthUser(user);
				this.contextService.setAuthUserId(user.id);
			} else {
				this.contextService.setAuthUser(undefined);
				this.contextService.setAuthUserId(undefined);
			}

			// Tenant 설정
			const spaceIdFromHeader = request.headers["x-space-id"] as string;

			// X-Space-ID 헤더가 없거나 사용자 정보가 없으면 tenant를 undefined로 설정
			if (
				!spaceIdFromHeader ||
				!user?.tenants ||
				!Array.isArray(user.tenants)
			) {
				this.contextService.setTenant(undefined);
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

				this.contextService.setTenant(undefined);
				return;
			}

			// Tenant 설정
			this.contextService.setTenant(tenant);

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
			this.contextService.setAuthUser(undefined);
			this.contextService.setAuthUserId(undefined);
			this.contextService.setTenant(undefined);
		}
	}
}

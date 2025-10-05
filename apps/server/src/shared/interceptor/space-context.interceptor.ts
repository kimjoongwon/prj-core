import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import { type TenantDto, type UserDto } from "@shared/schema";
import { type Request } from "express";
import { type Observable } from "rxjs";
import { ContextProvider } from "../provider";
import { AppLogger } from "../util/app-logger.util";

@Injectable()
export class SpaceContextInterceptor implements NestInterceptor {
	private readonly logger = new AppLogger(SpaceContextInterceptor.name);

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest<Request>();

		this.setSpaceContext(request);

		return next.handle();
	}

	private setSpaceContext(request: Request): void {
		try {
			const spaceIdFromHeader = request.headers["x-space-id"] as string;
			const user = request.user as UserDto;

			// X-Space-ID 헤더가 없으면 기본 컨텍스트 설정
			if (!spaceIdFromHeader) {
				this.setDefaultContext(user);
				return;
			}

			// 사용자 정보가 없으면 기본 컨텍스트 설정
			if (!user?.tenants || !Array.isArray(user.tenants)) {
				this.setDefaultContext(user);
				return;
			}

			// spaceId로 해당 tenant 찾기
			const currentTenant = user.tenants.find(
				(t: TenantDto) => t.spaceId === spaceIdFromHeader,
			);

			if (!currentTenant) {
				// 권한이 없어도 에러를 발생시키지 않고 null로 설정
				this.logger.warn("Space 접근 권한 없음", {
					spaceId: spaceIdFromHeader.slice(-8),
					userId: user.id,
				});

				ContextProvider.setAuthContext({
					user,
					tenant: undefined,
					tenantId: undefined,
					spaceId: spaceIdFromHeader,
				});
				return;
			}

			// 성공적인 컨텍스트 설정
			ContextProvider.setAuthContext({
				user,
				tenant: currentTenant,
				tenantId: currentTenant.id,
				spaceId: spaceIdFromHeader,
			});

			this.logger.dev("Space 컨텍스트 설정 완료", {
				spaceId: spaceIdFromHeader.slice(-8),
				tenantId: currentTenant.id.slice(-8),
				userId: user.id,
			});
		} catch (error) {
			this.logger.error(
				`Space 컨텍스트 설정 실패: ${error instanceof Error ? error.message : String(error)}`,
			);

			// 에러가 발생해도 기본 컨텍스트로 설정하여 요청이 계속 진행되도록 함
			const user = request.user as UserDto;
			this.setDefaultContext(user);
		}
	}

	private setDefaultContext(user?: UserDto): void {
		ContextProvider.setAuthContext({
			user: user || undefined,
			tenant: undefined,
			tenantId: undefined,
			spaceId: undefined,
		});
	}
}

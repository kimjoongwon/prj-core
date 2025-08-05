import {
	type CallHandler,
	type ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { type TenantDto, type UserDto } from "@shared/schema";
import { type Request } from "express";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import {
	AUTH_OPTIONS_KEY,
	type AuthOptions,
} from "../decorator/auth.decorator";
import { ContextProvider } from "../provider";
import { AppLogger } from "../util/app-logger.util";

interface AuthContext {
	tenantId?: string;
	user?: UserDto;
	requestId?: string;
	currentTenant?: TenantDto;
	tenantsMap?: Map<string, TenantDto>;
}

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
	private readonly logger = new AppLogger(AuthUserInterceptor.name);

	constructor(private reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const startTime = Date.now();
		const request = context.switchToHttp().getRequest();
		const requestId =
			request.headers["x-request-id"] || this.generateRequestId();

		try {
			const authContext = this.extractAuthContext(request, requestId);
			this.logRequestStart(authContext, requestId);
			this.setContextProviders(authContext);

			// Check Auth options and inject tenantId to query/body
			this.injectTenantIdFromAuthOptions(context, authContext);

			return next.handle().pipe(
				tap(() => {
					const duration = Date.now() - startTime;
					this.logRequestSuccess(requestId, duration);
				}),
				catchError((error) => {
					const duration = Date.now() - startTime;
					this.logRequestError(error, requestId, duration);
					return throwError(() => this.handleError(error));
				}),
			);
		} catch (error) {
			const duration = Date.now() - startTime;
			this.logInterceptorError(error, requestId, duration);
			throw this.handleError(error);
		}
	}

	private extractAuthContext(request: Request, requestId: string): AuthContext {
		try {
			let tenantId = request.cookies?.tenantId;
			const user = request.user as UserDto;

			// tenant 검색 성능 최적화: O(n) → O(1)
			let tenantsMap: Map<string, TenantDto> | undefined;
			let currentTenant: TenantDto | undefined;

			if (user?.tenants && Array.isArray(user.tenants)) {
				tenantsMap = new Map(user.tenants.map((tenant) => [tenant.id, tenant]));

				// tenantId가 없으면 main tenant 또는 첫 번째 tenant 사용
				if (!tenantId && user.tenants.length > 0) {
					const mainTenant = user.tenants.find((t) => t.main);
					currentTenant = mainTenant || user.tenants[0];
					tenantId = currentTenant.id;
				} else {
					currentTenant = tenantId ? tenantsMap.get(tenantId) : undefined;
				}
			}

			// 디버깅을 위한 상세한 로깅
			return {
				tenantId,
				user,
				currentTenant,
				requestId,
				tenantsMap,
			};
		} catch (error) {
			this.logger.error(
				`요청 ${requestId}에 대한 인증 컨텍스트 추출 실패: ${error instanceof Error ? error.message : String(error)}`,
				error instanceof Error ? error.stack : "",
			);
			throw new HttpException(
				"인증 컨텍스트 처리에 실패했습니다",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	private setContextProviders(authContext: AuthContext): void {
		try {
			// 성능 최적화: 배치 컨텍스트 설정
			const isValidUserAuth = !!(
				authContext.user && this.isValidUser(authContext.user)
			);

			ContextProvider.setAuthContext({
				user: isValidUserAuth ? authContext.user : undefined,
				tenant: authContext.currentTenant,
				tenantId: authContext.tenantId,
				spaceId: authContext.currentTenant?.spaceId,
			});

			// 로깅 처리
			this.logContextResults(authContext, isValidUserAuth);
		} catch (error) {
			const reqIdShort = authContext.requestId?.slice(-8);

			this.logger.error(
				`컨텍스트 설정 실패: ${error instanceof Error ? error.message : String(error)}`,
				`req:${reqIdShort}`,
			);
			throw new HttpException(
				"인증 컨텍스트 설정에 실패했습니다",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	private logContextResults(
		authContext: AuthContext,
		isValidUserAuth: boolean,
	): void {
		const reqIdShort = authContext.requestId?.slice(-8);

		if (authContext.currentTenant) {
			const tenantIdShort = authContext.currentTenant.id?.slice(-8);
			const spaceIdShort = authContext.currentTenant.spaceId?.slice(-8);

			this.logger.dev("테넌트 컨텍스트 설정됨", {
				reqId: reqIdShort,
				tenantId: tenantIdShort,
				spaceId: spaceIdShort,
			});
		} else if (authContext.tenantId) {
			const tenantIdShort = authContext.tenantId?.slice(-8);

			this.logger.warn("테넌트 ID는 존재하지만 테넌트를 찾을 수 없음", {
				reqId: reqIdShort,
				tenantId: tenantIdShort,
				hasUser: !!authContext.user,
				userTenantsCount: authContext.user?.tenants?.length || 0,
			});
		}

		if (isValidUserAuth && authContext.user) {
			this.logger.user("사용자 인증됨", {
				userId: authContext.user.id,
				tenants: authContext.user.tenants?.length || 0,
			});
		} else if (authContext.user) {
			this.logger.dev("잘못된 사용자 객체", {
				reqId: reqIdShort,
				hasId: !!authContext.user.id,
				hasTenants: !!authContext.user.tenants,
			});
		}
	}

	private isValidUser(user: UserDto): boolean {
		return !!(user?.id && user.tenants && Array.isArray(user.tenants));
	}

	private logRequestStart(authContext: AuthContext, requestId: string): void {
		const reqIdShort = requestId.slice(-8);

		this.logger.auth("컨텍스트 초기화됨", {
			reqId: reqIdShort,
			tenantId: authContext.tenantId,
			hasUser: !!authContext.user?.id,
		});
	}

	private logRequestSuccess(requestId: string, duration: number): void {
		const reqIdShort = requestId.slice(-8);

		this.logger.performance("인증 처리", duration, `req:${reqIdShort}`);
	}

	private logRequestError(
		error: any,
		requestId: string,
		duration: number,
	): void {
		const reqIdShort = requestId.slice(-8);

		this.logger.error(
			`❌ 인증 실패 (${duration}ms) - ${error.message}`,
			`req:${reqIdShort}`,
		);
	}

	private logInterceptorError(
		error: any,
		requestId: string,
		duration: number,
	): void {
		const reqIdShort = requestId.slice(-8);

		this.logger.errorWithStack(
			`인증 인터셉터 오류 (${duration}ms)`,
			error,
			`req:${reqIdShort}`,
		);
	}

	private handleError(error: any): HttpException {
		if (error instanceof HttpException) {
			return error;
		}

		this.logger.errorWithStack("처리되지 않은 인증 오류", error);

		return new HttpException(
			"인증 처리 중 내부 서버 오류 발생",
			HttpStatus.INTERNAL_SERVER_ERROR,
		);
	}

	private generateRequestId(): string {
		return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
	}

	private injectTenantIdFromAuthOptions(
		context: ExecutionContext,
		authContext: AuthContext,
	): void {
		try {
			// Get Auth options from metadata
			const authOptions = this.reflector.getAllAndOverride<AuthOptions>(
				AUTH_OPTIONS_KEY,
				[context.getHandler(), context.getClass()],
			);

			const reqIdShort = authContext.requestId?.slice(-8);
			const tenantIdShort = authContext.tenantId?.slice(-8);

			// If no Auth options or injectTenant is false, skip injection
			if (!authOptions || authOptions.injectTenant === false) {
				this.logger.log("테넌트 주입 건너뛰기", {
					reqId: reqIdShort,
					reason: !authOptions ? "no-auth-options" : "inject-tenant-false",
				});
				return;
			}

			// If tenantId is not available, skip injection
			if (!authContext.tenantId) {
				this.logger.log("테넌트 주입 건너뛰기 - tenantId 없음", {
					reqId: reqIdShort,
				});
				return;
			}

			const request = context.switchToHttp().getRequest();
			const method = request.method?.toUpperCase();

			this.logger.log("Auth 데코레이터에 따라 tenantId 주입", {
				reqId: reqIdShort,
				tenantId: tenantIdShort,
				method,
			});

			// Inject tenantId based on HTTP method
			if (method === "GET" || method === "DELETE") {
				// For GET/DELETE requests, inject to query parameters
				if (!request.query.tenantId) {
					// Get current URL and parse it
					const url = new URL(request.url, `http://${request.headers.host}`);

					// Add tenantId to search params
					url.searchParams.set("tenantId", authContext.tenantId);

					// Update the request URL
					request.url = url.pathname + url.search;

					// Delete query to force re-parsing on next access
					delete request.query;

					this.logger.log("Auth 옵션을 통해 쿼리에 TenantId 주입됨", {
						reqId: reqIdShort,
						tenantId: tenantIdShort,
						method,
					});
				} else {
					this.logger.log("쿼리에 TenantId가 이미 존재함", {
						reqId: reqIdShort,
						existingTenantId: request.query.tenantId,
						method,
					});
				}
			} else if (method === "POST" || method === "PUT" || method === "PATCH") {
				// For POST/PUT/PATCH requests, tenantId is handled through ContextProvider
				// Don't inject tenantId directly to body as it conflicts with Prisma schema
				this.logger.log(
					"body 작업에 대해 ContextProvider를 통해 TenantId 사용 가능",
					{
						reqId: reqIdShort,
						tenantId: tenantIdShort,
						method,
					},
				);
			}
		} catch (error) {
			const reqIdShort = authContext.requestId?.slice(-8);

			this.logger.error(
				`Auth 옵션을 통한 tenantId 주입 실패: ${error instanceof Error ? error.message : String(error)}`,
				`req:${reqIdShort}`,
			);
			// Don't throw error, just log and continue
		}
	}
}

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
import { INJECT_TENANT_ID_KEY } from "../decorator/inject-tenant-id.decorator";
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

			// Check if @InjectTenantId decorator is present and inject tenantId to query
			this.injectTenantIdToQuery(context, authContext);

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

			// 로깅 최적화: slice 연산 최소화
			const reqIdShort = requestId.slice(-8);
			const userIdShort = user?.id?.slice(-8);
			const tenantIdShort = tenantId?.slice(-8);
			const spaceIdShort = currentTenant?.spaceId?.slice(-8);

			// 디버깅을 위한 상세한 로깅
			this.logger.error("Auth context extraction DEBUG", {
				reqId: reqIdShort,
				hasUser: !!user,
				userId: userIdShort,
				tenantId: tenantIdShort,
				tenantsCount: user?.tenants?.length || 0,
				hasTenant: !!currentTenant,
				currentTenantSpaceId: spaceIdShort,
				userTenants: user?.tenants?.map((t) => ({
					id: t.id?.slice(-8),
					main: t.main,
				})),
			});

			return {
				tenantId,
				user,
				currentTenant,
				requestId,
				tenantsMap,
			};
		} catch (error) {
			this.logger.error(
				`Failed to extract auth context for request ${requestId}: ${error instanceof Error ? error.message : String(error)}`,
				error instanceof Error ? error.stack : "",
			);
			throw new HttpException(
				"Failed to process authentication context",
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
				`Context setup failed: ${error instanceof Error ? error.message : String(error)}`,
				`req:${reqIdShort}`,
			);
			throw new HttpException(
				"Failed to set authentication context",
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

			this.logger.dev("Tenant context set", {
				reqId: reqIdShort,
				tenantId: tenantIdShort,
				spaceId: spaceIdShort,
			});
		} else if (authContext.tenantId) {
			const tenantIdShort = authContext.tenantId?.slice(-8);

			this.logger.warn("Tenant ID exists but tenant not found", {
				reqId: reqIdShort,
				tenantId: tenantIdShort,
				hasUser: !!authContext.user,
				userTenantsCount: authContext.user?.tenants?.length || 0,
			});
		}

		if (isValidUserAuth && authContext.user) {
			this.logger.user("User authenticated", {
				userId: authContext.user.id,
				tenants: authContext.user.tenants?.length || 0,
			});
		} else if (authContext.user) {
			this.logger.dev("Invalid user object", {
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

		this.logger.auth("Context initialized", {
			reqId: reqIdShort,
			tenantId: authContext.tenantId,
			hasUser: !!authContext.user?.id,
		});
	}

	private logRequestSuccess(requestId: string, duration: number): void {
		const reqIdShort = requestId.slice(-8);

		this.logger.performance("Auth processing", duration, `req:${reqIdShort}`);
	}

	private logRequestError(
		error: any,
		requestId: string,
		duration: number,
	): void {
		const reqIdShort = requestId.slice(-8);

		this.logger.error(
			`❌ Auth failed (${duration}ms) - ${error.message}`,
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
			`Auth interceptor error (${duration}ms)`,
			error,
			`req:${reqIdShort}`,
		);
	}

	private handleError(error: any): HttpException {
		if (error instanceof HttpException) {
			return error;
		}

		this.logger.errorWithStack("Unhandled auth error", error);

		return new HttpException(
			"Internal server error during authentication processing",
			HttpStatus.INTERNAL_SERVER_ERROR,
		);
	}

	private generateRequestId(): string {
		return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
	}

	private injectTenantIdToQuery(
		context: ExecutionContext,
		authContext: AuthContext,
	): void {
		try {
			// Check if @InjectTenantId decorator is present on the handler
			const shouldInjectTenantId = this.reflector.getAllAndOverride<boolean>(
				INJECT_TENANT_ID_KEY,
				[context.getHandler(), context.getClass()],
			);

			if (!shouldInjectTenantId) {
				return;
			}

			const request = context.switchToHttp().getRequest();

			// Only inject if tenantId is available and not already present in query
			if (authContext.tenantId && !request.query.tenantId) {
				request.query.tenantId = authContext.tenantId;

				const reqIdShort = authContext.requestId?.slice(-8);
				const tenantIdShort = authContext.tenantId?.slice(-8);

				this.logger.dev("TenantId injected to query", {
					reqId: reqIdShort,
					tenantId: tenantIdShort,
				});
			}
		} catch (error) {
			const reqIdShort = authContext.requestId?.slice(-8);

			this.logger.error(
				`Failed to inject tenantId to query: ${error instanceof Error ? error.message : String(error)}`,
				`req:${reqIdShort}`,
			);
			// Don't throw error, just log and continue
		}
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

			// If no Auth options or injectTenant is false, skip injection
			if (!authOptions || authOptions.injectTenant === false) {
				return;
			}

			// If tenantId is not available, skip injection
			if (!authContext.tenantId) {
				return;
			}

			const request = context.switchToHttp().getRequest();
			const method = request.method?.toUpperCase();
			const reqIdShort = authContext.requestId?.slice(-8);
			const tenantIdShort = authContext.tenantId?.slice(-8);

			// Inject tenantId based on HTTP method
			if (method === "GET" || method === "DELETE") {
				// For GET/DELETE requests, inject to query parameters
				if (!request.query.tenantId) {
					request.query.tenantId = authContext.tenantId;

					this.logger.dev("TenantId injected to query via Auth options", {
						reqId: reqIdShort,
						tenantId: tenantIdShort,
						method,
					});
				}
			} else if (method === "POST" || method === "PUT" || method === "PATCH") {
				// For POST/PUT/PATCH requests, tenantId is handled through ContextProvider
				// Don't inject tenantId directly to body as it conflicts with Prisma schema
				this.logger.dev(
					"TenantId available via ContextProvider for body operations",
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
				`Failed to inject tenantId via Auth options: ${error instanceof Error ? error.message : String(error)}`,
				`req:${reqIdShort}`,
			);
			// Don't throw error, just log and continue
		}
	}
}

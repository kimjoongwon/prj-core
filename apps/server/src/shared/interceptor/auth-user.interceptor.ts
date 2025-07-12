import {
  type CallHandler,
  type ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { TenantDto, UserDto } from '@shared/schema';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ContextProvider } from '../provider';
import { AppLogger } from '../util/app-logger.util';

interface AuthContext {
  serviceId?: string;
  tenantId?: string;
  user?: UserDto;
  requestId?: string;
  currentTenant?: TenantDto; // Replace with actual type if available
}

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  private readonly logger = new AppLogger(AuthUserInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const requestId = request.headers['x-request-id'] || this.generateRequestId();

    try {
      const authContext = this.extractAuthContext(request, requestId);
      this.logRequestStart(authContext, requestId);
      this.setContextProviders(authContext);

      return next.handle().pipe(
        tap(() => {
          const duration = Date.now() - startTime;
          this.logRequestSuccess(requestId, duration);
        }),
        catchError((error) => {
          const duration = Date.now() - startTime;
          this.logRequestError(error, requestId, duration);
          return throwError(() => this.handleError(error));
        })
      );
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logInterceptorError(error, requestId, duration);
      throw this.handleError(error);
    }
  }

  private extractAuthContext(request: any, requestId: string): AuthContext {
    try {
      const serviceId = request.cookies?.serviceId;
      const tenantId = request.cookies?.tenantId;
      const user = request.user as UserDto;
      const currentTenant = user?.tenants?.find((tenant) => tenant.id === tenantId);

      // 디버깅을 위한 상세한 로깅
      this.logger.dev('Auth context extraction', {
        reqId: requestId.slice(-8),
        hasUser: !!user,
        userId: user?.id?.slice(-8),
        tenantId: tenantId?.slice(-8),
        tenantsCount: user?.tenants?.length || 0,
        hasTenant: !!currentTenant,
        currentTenantSpaceId: currentTenant?.spaceId?.slice(-8),
      });

      return {
        serviceId,
        tenantId,
        user,
        currentTenant,
        requestId,
      };
    } catch (error) {
      this.logger.error(
        `Failed to extract auth context for request ${requestId}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : ''
      );
      throw new HttpException(
        'Failed to process authentication context',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private setContextProviders(authContext: AuthContext): void {
    try {
      if (authContext.serviceId) {
        ContextProvider.setServiceId(authContext.serviceId);
      }

      if (authContext.tenantId) {
        ContextProvider.setTenantId(authContext.tenantId);
      }

      if (authContext.currentTenant) {
        ContextProvider.setTenant(authContext.currentTenant);
        // spaceId도 별도로 설정
        if (authContext.currentTenant.spaceId) {
          ContextProvider.setSpaceId(authContext.currentTenant.spaceId);
        }
        this.logger.dev('Tenant context set', {
          reqId: authContext.requestId?.slice(-8),
          tenantId: authContext.currentTenant.id?.slice(-8),
          spaceId: authContext.currentTenant.spaceId?.slice(-8),
        });
      } else if (authContext.tenantId) {
        this.logger.warn('Tenant ID exists but tenant not found', {
          reqId: authContext.requestId?.slice(-8),
          tenantId: authContext.tenantId?.slice(-8),
          hasUser: !!authContext.user,
          userTenantsCount: authContext.user?.tenants?.length || 0,
        });
      }

      if (authContext.user && this.isValidUser(authContext.user)) {
        ContextProvider.setAuthUser(authContext.user);
        ContextProvider.setAuthUserId(authContext.user.id);
        this.logger.user('User authenticated', {
          userId: authContext.user.id,
          tenants: authContext.user.tenants?.length || 0,
        });
      } else if (authContext.user) {
        this.logger.dev('Invalid user object', {
          reqId: authContext.requestId?.slice(-8),
          hasId: !!authContext.user.id,
          hasTenants: !!authContext.user.tenants,
        });
      }
    } catch (error) {
      this.logger.error(
        `Context setup failed: ${error instanceof Error ? error.message : String(error)}`,
        `req:${authContext.requestId?.slice(-8)}`
      );
      throw new HttpException(
        'Failed to set authentication context',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private isValidUser(user: UserDto): boolean {
    return !!(user?.id && user.tenants && Array.isArray(user.tenants));
  }

  private logRequestStart(authContext: AuthContext, requestId: string): void {
    this.logger.auth('Context initialized', {
      reqId: requestId.slice(-8),
      serviceId: authContext.serviceId,
      tenantId: authContext.tenantId,
      hasUser: !!authContext.user?.id,
    });
  }

  private logRequestSuccess(requestId: string, duration: number): void {
    this.logger.performance('Auth processing', duration, `req:${requestId.slice(-8)}`);
  }

  private logRequestError(error: any, requestId: string, duration: number): void {
    this.logger.error(
      `❌ Auth failed (${duration}ms) - ${error.message}`,
      `req:${requestId.slice(-8)}`
    );
  }

  private logInterceptorError(error: any, requestId: string, duration: number): void {
    this.logger.errorWithStack(
      `Auth interceptor error (${duration}ms)`,
      error,
      `req:${requestId.slice(-8)}`
    );
  }

  private handleError(error: any): HttpException {
    if (error instanceof HttpException) {
      return error;
    }

    this.logger.errorWithStack('Unhandled auth error', error);

    return new HttpException(
      'Internal server error during authentication processing',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

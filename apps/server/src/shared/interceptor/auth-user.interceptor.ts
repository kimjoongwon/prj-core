import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ContextProvider } from '../provider';
import { UserDto } from '../dto/user.dto';
import { AppLogger } from '../utils/app-logger.util';

interface AuthContext {
  serviceId?: string;
  tenantId?: string;
  user?: UserDto;
  requestId?: string;
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
        }),
      );
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logInterceptorError(error, requestId, duration);
      throw this.handleError(error);
    }
  }

  private extractAuthContext(request: any, requestId: string): AuthContext {
    try {
      const serviceId = request.cookies?.['serviceId'];
      const tenantId = request.cookies?.['tenantId'];
      const user = request.user as UserDto;

      return {
        serviceId,
        tenantId,
        user,
        requestId,
      };
    } catch (error) {
      this.logger.error(
        `Failed to extract auth context for request ${requestId}: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to process authentication context',
        HttpStatus.INTERNAL_SERVER_ERROR,
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

      if (this.isValidUser(authContext.user)) {
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
        `Context setup failed: ${error.message}`,
        `req:${authContext.requestId?.slice(-8)}`,
      );
      throw new HttpException(
        'Failed to set authentication context',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private isValidUser(user: UserDto): boolean {
    return user && user.id && user.tenants && Array.isArray(user.tenants);
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
      `req:${requestId.slice(-8)}`,
    );
  }

  private logInterceptorError(error: any, requestId: string, duration: number): void {
    this.logger.errorWithStack(
      `Auth interceptor error (${duration}ms)`,
      error,
      `req:${requestId.slice(-8)}`,
    );
  }

  private handleError(error: any): HttpException {
    if (error instanceof HttpException) {
      return error;
    }

    this.logger.errorWithStack('Unhandled auth error', error);

    return new HttpException(
      'Internal server error during authentication processing',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

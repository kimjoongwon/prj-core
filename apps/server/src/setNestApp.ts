import {
	ClassSerializerInterceptor,
	INestApplication,
	ValidationPipe,
} from "@nestjs/common";
import { HttpAdapterHost, Reflector } from "@nestjs/core";
import { AllExceptionsFilter, TokenStorageService } from "@shared";
import { JwtAuthGuard } from "./shared/guard";
import { RequestContextInterceptor } from "./shared/interceptor/request-context.interceptor";
import { ResponseEntityInterceptor } from "./shared/interceptor/response-entity.interceptor";

export function setNestApp<T extends INestApplication>(app: T): void {
	const httpAdapterHost = app.get(HttpAdapterHost);

	// =================================================================
	// Global Exception Filters (모든 예외를 일관되게 처리)
	// =================================================================
	app.useGlobalFilters(
		new AllExceptionsFilter(httpAdapterHost.httpAdapter), // 전역 예외 처리
	);

	// =================================================================
	// Global Pipes (데이터 검증 및 변환 - Controller 실행 전)
	// =================================================================
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true, // 자동 타입 변환 (string → number 등)
			whitelist: true, // DTO에 정의되지 않은 속성 자동 제거 (보안)
			forbidNonWhitelisted: false, // 정의되지 않은 속성 발견 시 에러 발생 여부
		}),
	);

	// =================================================================
	// Global Guards (JWT 인증)
	// Rate Limiting은 AppModule에서 APP_GUARD로 등록
	// =================================================================
	app.useGlobalGuards(
		new JwtAuthGuard(app.get(Reflector), app.get(TokenStorageService)),
	);

	// =================================================================
	// Global Interceptors - 실행 순서: RequestContextInterceptor → ClassSerializerInterceptor
	// =================================================================
	app.useGlobalInterceptors(
		app.get(RequestContextInterceptor),
		app.get(ResponseEntityInterceptor),
		new ClassSerializerInterceptor(app.get(Reflector)),
	);
}

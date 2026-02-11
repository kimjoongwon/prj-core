import {
	AllExceptionsFilter,
	DtoTransformInterceptor,
	JwtAuthGuard,
	ResponseEntityInterceptor,
	SpaceAccessGuard,
	SpaceScopeInterceptor,
} from "@cocrepo/be-common";
import { TranslationService } from "@cocrepo/service";
import { TokenStorageService } from "@cocrepo/service";
import { ClsService } from "nestjs-cls";
import {
	ClassSerializerInterceptor,
	type INestApplication,
	ValidationPipe,
} from "@nestjs/common";
import { HttpAdapterHost, Reflector } from "@nestjs/core";

export function setNestApp<T extends INestApplication>(app: T): void {
	const { httpAdapter } = app.get(HttpAdapterHost);
	const translationService = app.get(TranslationService);

	// =================================================================
	// Global Exception Filters (모든 예외를 일관되게 처리)
	// =================================================================
	app.useGlobalFilters(
		new AllExceptionsFilter(httpAdapter, translationService),
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
	// Global Guards (JWT 인증 + Space 접근 제어)
	// AuthMiddleware가 request.user를 설정한 후 Guard가 검증
	// =================================================================
	app.useGlobalGuards(
		new JwtAuthGuard(app.get(Reflector), app.get(TokenStorageService), app.get(ClsService)),
		app.get(SpaceAccessGuard),
	);

	// =================================================================
	// Global Interceptors - Response 처리는 역순!
	// Request: 1→2→3→4 | Response: 4→3→2→1
	// RequestContextInterceptor 제거 → Middleware로 이동
	// =================================================================
	app.useGlobalInterceptors(
		app.get(SpaceScopeInterceptor), // 1 (Request: 데코레이터 기반 EFFECTIVE_SPACE_IDS 계산)
		app.get(ResponseEntityInterceptor), // 2 (Response: 래핑)
		new ClassSerializerInterceptor(app.get(Reflector)), // 3 (Response: 직렬화)
		new DtoTransformInterceptor(app.get(Reflector)), // 4 (Response: DTO 변환 및 exclude)
	);
}

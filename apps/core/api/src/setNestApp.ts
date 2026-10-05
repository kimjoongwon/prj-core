import {
	AllExceptionsFilter,
	BigIntResponseInterceptor,
	DtoTransformInterceptor,
	JwtAuthGuard,
	ResponseEntityInterceptor,
	SpaceAccessGuard,
	SpaceScopeInterceptor,
} from "@cocrepo/be-common";
import { I18nTranslationService, TokenStorageService } from "@cocrepo/service";
import {
	type ArgumentsHost,
	Catch,
	ClassSerializerInterceptor,
	type HttpServer,
	type INestApplication,
	Logger,
} from "@nestjs/common";
import { BaseExceptionFilter, HttpAdapterHost, Reflector } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { ClsService } from "nestjs-cls";
import { ApiValidationPipe } from "./validation/api-validation.pipe";

@Catch()
class IdpAllExceptionsFilter extends BaseExceptionFilter {
	private readonly logger = new Logger(IdpAllExceptionsFilter.name);

	constructor(
		applicationRef: HttpServer,
		private readonly innerFilter: AllExceptionsFilter,
	) {
		super(applicationRef);
	}

	catch(exception: unknown, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse();

		if (response.headersSent) {
			this.logger.debug(
				"Headers already sent, skipping exception filter response",
			);
			return;
		}

		return this.innerFilter.catch(exception, host);
	}
}

export function setNestApp<T extends INestApplication>(app: T): void {
	const httpAdapterHost = app.get(HttpAdapterHost);
	const translationService = app.get(I18nTranslationService);

	// Cookie 기반 인증/Space 선택을 위해 테스트/런타임 모두 cookie-parser를 등록합니다.
	app.use(cookieParser());

	// =================================================================
	// Global Exception Filters (모든 예외를 일관되게 처리)
	// =================================================================
	const allExceptionsFilter = new AllExceptionsFilter(
		httpAdapterHost.httpAdapter,
		translationService,
	);
	app.useGlobalFilters(
		new IdpAllExceptionsFilter(
			httpAdapterHost.httpAdapter,
			allExceptionsFilter,
		),
	);

	// =================================================================
	// Global Pipes (데이터 검증 및 변환 - Controller 실행 전)
	// =================================================================
	app.useGlobalPipes(new ApiValidationPipe());

	// =================================================================
	// Global Guards (JWT 인증 + Space 접근 제어)
	// AuthMiddleware가 request.user를 설정한 후 Guard가 검증
	// =================================================================
	app.useGlobalGuards(
		new JwtAuthGuard(
			app.get(Reflector),
			app.get(TokenStorageService),
			app.get(ClsService),
		),
		app.get(SpaceAccessGuard),
	);

	// =================================================================
	// Global Interceptors - Response 처리는 역순!
	// Request: 0→1→2→3→4 | Response: 4→3→2→1→0
	// RequestContextInterceptor 제거 → Middleware로 이동
	// =================================================================
	app.useGlobalInterceptors(
		app.get(BigIntResponseInterceptor), // 0 (Response: 최종 bigint → decimal string)
		app.get(SpaceScopeInterceptor), // 1 (Request: 데코레이터 기반 EFFECTIVE_SPACE_IDS 계산)
		app.get(ResponseEntityInterceptor), // 2 (Response: 래핑)
		new ClassSerializerInterceptor(app.get(Reflector), {
			enableCircularCheck: true,
		}), // 3 (Response: 직렬화, 순환 참조 안전)
		new DtoTransformInterceptor(app.get(Reflector)), // 4 (Response: DTO 변환 및 exclude)
	);
}

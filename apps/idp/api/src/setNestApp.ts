import {
	AllExceptionsFilter,
	DtoTransformInterceptor,
	JwtAuthGuard,
	ResponseEntityInterceptor,
	SpaceAccessGuard,
	SpaceScopeInterceptor,
} from "@cocrepo/be-common";
import { TokenStorageService, I18nTranslationService } from "@cocrepo/service";
import {
	type ArgumentsHost,
	Catch,
	ClassSerializerInterceptor,
	type HttpServer,
	type INestApplication,
	Logger,
	ValidationPipe,
} from "@nestjs/common";
import { BaseExceptionFilter, HttpAdapterHost, Reflector } from "@nestjs/core";
import { ClsService } from "nestjs-cls";

/**
 * IdP 전용 예외 필터
 *
 * AllExceptionsFilter를 래핑하여 oidc-provider가 자체적으로 응답을 처리한 후
 * 추가 응답을 보내지 않도록 headersSent 체크를 추가합니다.
 */
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
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		// oidc-provider가 이미 응답을 보낸 경우 무시
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
	const { httpAdapter } = app.get(HttpAdapterHost);
	const translationService = app.get(I18nTranslationService);

	// =================================================================
	// Global Exception Filters
	// AllExceptionsFilter를 래핑하여 headersSent 체크 추가
	// =================================================================
	const allExceptionsFilter = new AllExceptionsFilter(
		httpAdapter,
		translationService,
	);
	app.useGlobalFilters(
		new IdpAllExceptionsFilter(httpAdapter, allExceptionsFilter),
	);

	// =================================================================
	// Global Pipes (데이터 검증 및 변환)
	// =================================================================
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: false,
		}),
	);

	// =================================================================
	// Global Guards (JWT 인증 + Space 접근 제어)
	// @Public() 데코레이터가 있는 OIDC/interaction/password-reset 경로는 스킵됨
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
	// Request: 1→2→3→4 | Response: 4→3→2→1
	// =================================================================
	app.useGlobalInterceptors(
		app.get(SpaceScopeInterceptor),
		app.get(ResponseEntityInterceptor),
		new ClassSerializerInterceptor(app.get(Reflector), {
			enableCircularCheck: true,
		}),
		new DtoTransformInterceptor(app.get(Reflector)),
	);
}

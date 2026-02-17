import { CONTEXT_KEYS } from "@cocrepo/constant";
import { PUBLIC_ROUTE_KEY } from "@cocrepo/decorator";
import { TokenStorageService } from "@cocrepo/service";
import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClsService } from "nestjs-cls";

/**
 * JWT 인증 Guard (Passport 의존 제거)
 *
 * AuthMiddleware가 먼저 실행되어 request.user를 설정한 상태에서 동작
 * - request.user 존재 여부 확인
 * - Access Token 블랙리스트 확인 (Bearer/Cookie 모두)
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
	private readonly logger = new Logger(JwtAuthGuard.name);

	constructor(
		private reflector: Reflector,
		private tokenStorageService: TokenStorageService,
		private cls: ClsService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(
			PUBLIC_ROUTE_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (isPublic) {
			return true;
		}

		const request = context.switchToHttp().getRequest();

		// Access Token 블랙리스트 확인 (JwtStrategy extractor가 CLS에 저장한 토큰)
		const accessToken = this.cls.get<string | undefined>(
			CONTEXT_KEYS.TOKEN,
		);
		if (accessToken) {
			const isBlacklisted =
				await this.tokenStorageService.isBlacklisted(accessToken);

			if (isBlacklisted) {
				this.logger.warn("블랙리스트에 등록된 토큰입니다");
				throw new UnauthorizedException("토큰이 무효화되었습니다");
			}
		}

		// AuthMiddleware가 설정한 request.user 확인
		if (!request.user) {
			this.logger.debug("JWT 인증 실패: request.user가 없습니다");
			throw new UnauthorizedException("유효하지 않은 인증 정보입니다");
		}

		return true;
	}
}

import { PUBLIC_ROUTE_KEY } from "@cocrepo/decorator";
import { TokenStorageService } from "@cocrepo/service";
import {
	type ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	private readonly logger = new Logger(JwtAuthGuard.name);

	constructor(
		private reflector: Reflector,
		private tokenStorageService: TokenStorageService,
	) {
		super();
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.get<boolean>(
			PUBLIC_ROUTE_KEY,
			context.getHandler(),
		);

		if (isPublic) {
			return true;
		}

		// Access Token 블랙리스트 확인
		const request = context.switchToHttp().getRequest();
		const accessToken = request.cookies?.accessToken;
		if (accessToken) {
			return this.checkBlacklistAndActivate(accessToken, context);
		}

		return super.canActivate(context);
	}

	private async checkBlacklistAndActivate(
		accessToken: string,
		context: ExecutionContext,
	): Promise<boolean> {
		const isBlacklisted =
			await this.tokenStorageService.isBlacklisted(accessToken);

		if (isBlacklisted) {
			this.logger.warn("블랙리스트에 등록된 토큰입니다");
			throw new UnauthorizedException("토큰이 무효화되었습니다");
		}

		return super.canActivate(context) as boolean | Promise<boolean>;
	}

	handleRequest(err: any, user: any, info: any) {
		if (err) {
			this.logger.debug(`JWT 인증 오류: ${err.message}`);
			throw err;
		}

		if (!user) {
			this.logger.debug(
				`JWT 인증 실패: ${JSON.stringify(info)}`,
			);
			throw new UnauthorizedException("유효하지 않은 인증 정보입니다");
		}

		return user;
	}
}

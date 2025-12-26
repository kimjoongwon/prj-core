import { PUBLIC_ROUTE_KEY } from "@cocrepo/decorator";
import { TokenStorageService } from "@cocrepo/service";
import {
	ExecutionContext,
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

		const request = context.switchToHttp().getRequest();

		this.logger.log(`JwtAuthGuard canActivate - 공개 라우트 여부: ${isPublic}`);
		this.logger.log(`요청 경로: ${request.path}`);
		this.logger.log(`요청 메서드: ${request.method}`);
		this.logger.log(`Authorization 헤더: ${request.headers.authorization}`);

		if (isPublic) {
			this.logger.log("공개 라우트입니다, 접근을 허용합니다");
			return true;
		}

		// Access Token 블랙리스트 확인
		const accessToken = request.cookies?.accessToken;
		if (accessToken) {
			return this.checkBlacklistAndActivate(accessToken, context);
		}

		this.logger.log("보호된 라우트입니다, JWT를 확인합니다");
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

		this.logger.log("보호된 라우트입니다, JWT를 확인합니다");
		return super.canActivate(context) as boolean | Promise<boolean>;
	}

	handleRequest(err: any, user: any, info: any) {
		this.logger.log(
			`JWT handleRequest - 오류: ${!!err}, 사용자: ${!!user}, 정보: ${JSON.stringify(info)}`,
		);

		if (err) {
			this.logger.log(`JWT 인증 오류: ${err.message}`, err.stack);
			throw err;
		}

		if (!user) {
			this.logger.log(
				`JWT 인증 실패 - 사용자를 찾을 수 없습니다. 정보: ${JSON.stringify(info)}`,
			);
			throw new UnauthorizedException("인증에 실패했습니다");
		}

		this.logger.log(`사용자 ${user.id}의 JWT 인증이 성공했습니다`);
		return user;
	}
}

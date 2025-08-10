import {
	ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { PUBLIC_ROUTE_KEY } from "../decorator/public-route.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	private readonly logger = new Logger(JwtAuthGuard.name);

	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.get<boolean>(
			PUBLIC_ROUTE_KEY,
			context.getHandler(),
		);
		const request = context.switchToHttp().getRequest();

		this.logger.error(
			`JwtAuthGuard canActivate - 공개 라우트 여부: ${isPublic}`,
		);
		this.logger.error(`요청 경로: ${request.path}`);
		this.logger.error(`요청 메서드: ${request.method}`);
		this.logger.error(`Authorization 헤더: ${request.headers.authorization}`);

		if (isPublic) {
			this.logger.log("공개 라우트입니다, 접근을 허용합니다");
			return true;
		}

		this.logger.log("보호된 라우트입니다, JWT를 확인합니다");
		return super.canActivate(context);
	}

	handleRequest(err: any, user: any, info: any) {
		this.logger.log(
			`JWT handleRequest - 오류: ${!!err}, 사용자: ${!!user}, 정보: ${JSON.stringify(info)}`,
		);

		if (err) {
			this.logger.error(`JWT 인증 오류: ${err.message}`, err.stack);
			throw err;
		}

		if (!user) {
			this.logger.error(
				`JWT 인증 실패 - 사용자를 찾을 수 없습니다. 정보: ${JSON.stringify(info)}`,
			);
			throw new UnauthorizedException("인증에 실패했습니다");
		}

		this.logger.log(`사용자 ${user.id}의 JWT 인증이 성공했습니다`);
		return user;
	}
}

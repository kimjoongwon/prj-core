import { CONTEXT_KEYS } from "@cocrepo/constant";
import { UsersService } from "@cocrepo/service";
import {
	Global,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ClsService } from "nestjs-cls";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthConfig } from "@cocrepo/type";

@Global()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	private readonly logger = new Logger(JwtStrategy.name);

	constructor(
		readonly config: ConfigService,
		readonly usersService: UsersService,
		private readonly cls: ClsService,
	) {
		const authConfig = config.get<AuthConfig>("auth");

		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				// 첫 번째로 쿠키에서 토큰을 추출 시도
				(req: Request) => {
					this.logger.log("[쿠키 추출기] 호출됨");
					this.logger.log(
						`[쿠키 추출기] 전체 요청 쿠키: ${JSON.stringify(req.cookies)}`,
					);
					this.logger.log(
						`[쿠키 추출기] 원본 쿠키 헤더: ${req.headers.cookie}`,
					);

					const token = req.cookies?.accessToken;

					if (token) {
						this.logger.log(
							`[쿠키 추출기] ✅ 쿠키에서 토큰 발견 - 길이: ${token.length}`,
						);
						this.logger.log(
							`[쿠키 추출기] 토큰 미리보기: ${token.substring(0, 30)}...`,
						);
						this.cls.set(CONTEXT_KEYS.TOKEN, token);
						return token;
					}
					this.logger.log(
						"[쿠키 추출기] ❌ 쿠키에서 accessToken을 찾을 수 없음",
					);
					return null;
				},
				// 두 번째로 Authorization 헤더에서 토큰을 추출 시도
				(req: Request) => {
					this.logger.log("[헤더 추출기] 호출됨");
					this.logger.log(
						`[헤더 추출기] Authorization 헤더: ${req.headers?.authorization}`,
					);

					const authHeader = req.headers?.authorization;
					if (authHeader?.startsWith("Bearer ")) {
						const token = authHeader.split(" ")[1];
						this.logger.log(
							`[헤더 추출기] ✅ 헤더에서 토큰 발견 - 길이: ${token.length}`,
						);
						this.logger.log(
							`[헤더 추출기] 토큰 미리보기: ${token.substring(0, 30)}...`,
						);
						this.cls.set(CONTEXT_KEYS.TOKEN, token);
						return token;
					}
					this.logger.log(
						"[헤더 추출기] ❌ Authorization 헤더에서 Bearer 토큰을 찾을 수 없음",
					);
					return null;
				},
			]),
			secretOrKey: authConfig?.secret || "fallback-secret",
		});
	}

	async validate(payload: { userId: string; iat: number; exp: number }) {
		this.logger.error(
			`JWT 검증이 호출됨, 페이로드: ${JSON.stringify(payload)}`,
		);

		try {
			// Get user with tenant information for JWT validation
			const user = await this.usersService.getByIdWithTenants(payload.userId);

			if (!user) {
				this.logger.error(
					`사용자 ID로 사용자를 찾을 수 없음: ${payload.userId}`,
				);
				throw new UnauthorizedException("사용자를 찾을 수 없습니다");
			}

			this.logger.error(
				`JWT 전략 - 사용자 발견: ${user.id}, 테넌트 수: ${user.tenants?.length || 0}`,
			);
			this.logger.error(
				`JWT 전략 - 사용자 테넌트: ${JSON.stringify(user.tenants?.map((t) => ({ id: t.id, main: t.main })))}`,
			);

			// User 엔티티를 직접 반환 (도메인 로직 포함)
			return user;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			const errorStack = error instanceof Error ? error.stack : "";
			this.logger.error(`JWT 검증 중 오류 발생: ${errorMessage}`, errorStack);
			throw error;
		}
	}
}

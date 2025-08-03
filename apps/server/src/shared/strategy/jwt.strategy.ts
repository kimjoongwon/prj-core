import {
	Global,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthConfig, ContextProvider } from "..";
import { UsersService } from "../service/users.service";

@Global()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	private readonly logger = new Logger(JwtStrategy.name);

	constructor(
		readonly config: ConfigService,
		readonly usersService: UsersService,
	) {
		const authConfig = config.get<AuthConfig>("auth");

		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				// 첫 번째로 쿠키에서 토큰을 추출 시도
				(req: Request) => {
					this.logger.log("[Cookie Extractor] Called");
					this.logger.log(
						`[Cookie Extractor] Full request cookies: ${JSON.stringify(req.cookies)}`,
					);
					this.logger.log(
						`[Cookie Extractor] Raw cookie header: ${req.headers.cookie}`,
					);

					const token = req.cookies?.accessToken;

					if (token) {
						this.logger.log(
							`[Cookie Extractor] ✅ Token found in cookies - Length: ${token.length}`,
						);
						this.logger.log(
							`[Cookie Extractor] Token preview: ${token.substring(0, 30)}...`,
						);
						ContextProvider.setToken(token);
						return token;
					}
					this.logger.log(
						"[Cookie Extractor] ❌ No accessToken found in cookies",
					);
					return null;
				},
				// 두 번째로 Authorization 헤더에서 토큰을 추출 시도
				(req: Request) => {
					this.logger.log("[Header Extractor] Called");
					this.logger.log(
						`[Header Extractor] Authorization header: ${req.headers?.authorization}`,
					);

					const authHeader = req.headers?.authorization;
					if (authHeader?.startsWith("Bearer ")) {
						const token = authHeader.split(" ")[1];
						this.logger.log(
							`[Header Extractor] ✅ Token found in headers - Length: ${token.length}`,
						);
						this.logger.log(
							`[Header Extractor] Token preview: ${token.substring(0, 30)}...`,
						);
						ContextProvider.setToken(token);
						return token;
					}
					this.logger.log(
						"[Header Extractor] ❌ No Bearer token found in Authorization header",
					);
					return null;
				},
			]),
			secretOrKey: authConfig?.secret || "fallback-secret",
		});
	}

	async validate(payload: { userId: string; iat: number; exp: number }) {
		this.logger.error(
			`JWT validate called with payload: ${JSON.stringify(payload)}`,
		);

		try {
			const user = await this.usersService.getUnique({
				where: { id: payload.userId },
				include: {
					tenants: {
						include: {
							role: true,
						},
					},
				},
			});

			if (!user) {
				this.logger.error(`User not found for userId: ${payload.userId}`);
				throw new UnauthorizedException("User not found");
			}

			this.logger.error(
				`JWT Strategy - User found: ${user.id}, tenants: ${user.tenants?.length || 0}`,
			);
			this.logger.error(
				`JWT Strategy - User tenants: ${JSON.stringify(user.tenants?.map((t) => ({ id: t.id, main: t.main })))}`,
			);

			// user 객체를 직접 반환 ({ user } 래핑하지 않음)
			return user;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			const errorStack = error instanceof Error ? error.stack : "";
			this.logger.error(`Error in JWT validate: ${errorMessage}`, errorStack);
			throw error;
		}
	}
}

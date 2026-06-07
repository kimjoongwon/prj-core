import { CONTEXT_KEYS, PRISMA_SERVICE_TOKEN } from "@cocrepo/constant";
import {
	Inject,
	Injectable,
	type INestApplication,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ClsService } from "nestjs-cls";
import { ExtractJwt, Strategy } from "passport-jwt";

/**
 * 테스트 전용 JWT Strategy (HS256)
 *
 * 실제 JwtStrategy는 RS256 + JWKS (IDP 서버 필요)를 사용하지만,
 * 테스트에서는 HS256 + AUTH_JWT_SECRET으로 간단히 검증합니다.
 *
 * UserService 대신 PrismaService(@Global)를 직접 사용하여
 * 테스트 모듈의 DI 스코프 제한을 우회합니다.
 */
@Injectable()
export class TestJwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(PRISMA_SERVICE_TOKEN) private readonly prisma: any,
		private readonly cls: ClsService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					const authHeader = req.headers?.authorization;
					if (authHeader?.startsWith("Bearer ")) {
						const token = authHeader.split(" ")[1];
						cls.set(CONTEXT_KEYS.TOKEN, token);
						return token;
					}
					return null;
				},
			]),
			secretOrKey: process.env.AUTH_JWT_SECRET || "test-jwt-secret-e2e",
			algorithms: ["HS256"],
		});
	}

	async validate(payload: { sub: string }) {
		const user = await this.prisma.user.findFirst({
			where: { id: payload.sub, removedAt: null },
			include: {
				tenants: {
					include: { space: true },
					where: { removedAt: null },
				},
			},
		});
		if (!user) {
			throw new UnauthorizedException("테스트 사용자를 찾을 수 없습니다");
		}
		return user;
	}
}

export interface TestAuthOptions {
	roleCategoryName?: string | { name: string };
	roleName?: string;
	spaceId?: string;
	userEmail?: string;
}

/**
 * 테스트용 인증 정보를 설정합니다.
 *
 * DB에서 시드 사용자를 조회하고 JWT 토큰을 생성합니다.
 */
export async function getTestAuth(
	app: INestApplication,
	options: TestAuthOptions = {},
): Promise<{
	jwtToken: string;
	spaceId: string;
	userId: string;
}> {
	const prisma = app.get(PRISMA_SERVICE_TOKEN);
	const jwtService = app.get(JwtService);
	const configService = app.get(ConfigService);
	const testUserEmail =
		options.userEmail ?? process.env.E2E_API_AUTH_EMAIL ?? "admin@plate.com";
	const roleName =
		options.roleName ??
		(options.roleCategoryName || options.spaceId ? undefined : "FULL_ACCESS");
	const roleCategoryName =
		typeof options.roleCategoryName === "string"
			? options.roleCategoryName
			: options.roleCategoryName?.name;
	const oidcConfig = configService.get<{ issuer?: string }>("oidc");
	const issuer = oidcConfig?.issuer ?? process.env.OIDC_ISSUER;

	// 시드 사용자 조회
	const user = await prisma.user.findFirst({
		where: { email: testUserEmail },
		include: {
			tenants: {
				include: {
					role: {
						include: {
							classification: {
								include: {
									category: true,
								},
							},
						},
					},
					space: true,
				},
			},
		},
	});

	if (!user) {
		throw new Error(
			`테스트 사용자(${testUserEmail})를 찾을 수 없습니다. 시드 데이터를 확인하세요.`,
		);
	}

	if (!user.tenants || user.tenants.length === 0) {
		throw new Error(
			"테스트 사용자에게 할당된 테넌트가 없습니다. 시드 데이터를 확인하세요.",
		);
	}

	const tenant = user.tenants.find((candidate: any) => {
		if (options.spaceId && candidate.spaceId !== options.spaceId) {
			return false;
		}
		if (
			roleName &&
			candidate.role?.name !== roleName
		) {
			return false;
		}
		if (
			roleCategoryName &&
			candidate.role?.classification?.category?.name !== roleCategoryName
		) {
			return false;
		}
		return true;
	});

	if (!tenant) {
		throw new Error(
			`테스트 사용자(${testUserEmail})에게 조건에 맞는 테넌트가 없습니다. 조건=${JSON.stringify(options)}`,
		);
	}

	// HS256 JWT 토큰 생성 (TestJwtStrategy가 검증 가능)
	const token = jwtService.sign(
		{ sub: user.id },
		issuer ? { issuer } : undefined,
	);

	return {
		jwtToken: token,
		spaceId: tenant.spaceId,
		userId: user.id,
	};
}

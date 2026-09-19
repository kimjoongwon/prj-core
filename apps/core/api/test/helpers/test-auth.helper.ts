import { createPrivateKey, createPublicKey } from "node:crypto";
import { CONTEXT_KEYS, PRISMA_SERVICE_TOKEN } from "@cocrepo/constant";
import type { PrismaService } from "@cocrepo/service";
import { formatDatabaseId } from "@cocrepo/type";
import {
	type INestApplication,
	Inject,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ClsService } from "nestjs-cls";
import { ExtractJwt, Strategy } from "passport-jwt";

const DEFAULT_TEST_OIDC_ISSUER = "http://localhost:3000";

interface TestSigningJwk {
	[key: string]: unknown;
}

/**
 * OIDC 발급자와 같은 키(RS256, OIDC_JWKS_KEYS의 첫 키)로 서명한 테스트 토큰을
 * 발급한다. native HS256 경로 제거 이후 API e2e는 OIDC 토큰 형식만 사용한다.
 */
export const signOidcTestToken = (
	payload: Record<string, unknown>,
	issuer: string = getOidcTestIssuer(),
): string => {
	const signingJwk = resolveTestSigningJwk();
	const jwtService = new JwtService({
		privateKey: exportTestSigningKey("private"),
		signOptions: {
			algorithm: "RS256",
			issuer,
			...(typeof signingJwk.kid === "string"
				? { keyid: signingJwk.kid }
				: {}),
		},
	});

	return jwtService.sign(payload);
};

function resolveTestSigningJwk(): TestSigningJwk {
	const rawJwks = process.env.OIDC_JWKS_KEYS;
	if (!rawJwks) {
		throw new Error(
			"OIDC_JWKS_KEYS is not defined. apps/core/api/.env 설정을 확인하세요.",
		);
	}

	// 셸(source)과 dotenv가 이중 인용/이스케이프를 다르게 해석하므로 두 형태를 모두 정규화한다.
	const normalizedJwks = rawJwks
		.trim()
		.replace(/^"+|"+$/g, "")
		.replace(/\\"/g, '"');
	const jwks = JSON.parse(normalizedJwks) as { keys?: TestSigningJwk[] };
	const signingJwk = jwks.keys?.[0];
	if (!signingJwk || typeof signingJwk.d !== "string") {
		throw new Error(
			"OIDC_JWKS_KEYS 첫 키에 RS256 개인키(d)가 없습니다. 서명 키를 확인하세요.",
		);
	}

	return signingJwk;
}

/** OIDC 서명 키를 PEM 문자열로 변환한다. passport-jwt/jsonwebtoken가 PEM을 표준 입력으로 받는다. */
function exportTestSigningKey(kind: "private" | "public"): string {
	const jwkInput = {
		key: resolveTestSigningJwk(),
		format: "jwk",
	};

	if (kind === "private") {
		const privateKey = createPrivateKey(
			jwkInput as unknown as Parameters<typeof createPrivateKey>[0],
		);
		return privateKey.export({ type: "pkcs8", format: "pem" }).toString();
	}

	const publicKey = createPublicKey(
		jwkInput as unknown as Parameters<typeof createPublicKey>[0],
	);
	return publicKey.export({ type: "spki", format: "pem" }).toString();
}

export const getOidcTestIssuer = (): string =>
	process.env.OIDC_ISSUER ?? DEFAULT_TEST_OIDC_ISSUER;

export const getOidcTestPublicKeyPem = (): string =>
	exportTestSigningKey("public");

/**
 * 테스트 전용 JWT Strategy (RS256, OIDC 발급자 검증)
 *
 * 실제 JwtStrategy는 JWKS를 발급자 HTTP 엔드포인트(/oidc/jwks)에서 내려받지만,
 * 테스트에서는 OIDC_JWKS_KEYS의 공개키로 로컬에서 검증해 외부 서버 의존을 없앤다.
 * UserService 대신 PrismaService(@Global)를 직접 사용하여 테스트 모듈의 DI 스코프
 * 제한을 우회한다.
 */
@Injectable()
export class TestJwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(PRISMA_SERVICE_TOKEN) private readonly prisma: PrismaService,
		cls: ClsService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					const authHeader = req.headers.authorization;
					if (authHeader?.startsWith("Bearer ")) {
						const token = authHeader.slice("Bearer ".length);
						cls.set(CONTEXT_KEYS.TOKEN, token);
						return token;
					}
					return null;
				},
			]),
			secretOrKey: getOidcTestPublicKeyPem(),
			issuer: getOidcTestIssuer(),
			algorithms: ["RS256"],
		});
	}

	async validate(payload: { sub: string }) {
		const user = await this.prisma.user.findFirst({
			where: { userId: payload.sub, removedAt: null },
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
 * DB에서 시드 사용자를 조회하고 OIDC 형식(RS256) JWT 토큰을 생성합니다.
 */
export async function getTestAuth(
	app: INestApplication,
	options: TestAuthOptions = {},
): Promise<{
	jwtToken: string;
	tenantId: string;
	spaceId: string;
	userId: string;
}> {
	const prisma = app.get<PrismaService>(PRISMA_SERVICE_TOKEN);
	const configService = app.get(ConfigService);
	const testUserEmail =
		options.userEmail ?? process.env.E2E_API_AUTH_EMAIL ?? "admin@plate.com";
	const roleName =
		options.roleName ??
		(options.roleCategoryName || options.spaceId
			? undefined
			: "PLATFORM_ADMIN");
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

	const tenant = user.tenants.find((candidate) => {
		if (
			options.spaceId &&
			formatDatabaseId(candidate.space.id) !== options.spaceId
		) {
			return false;
		}
		if (roleName && candidate.role?.name !== roleName) {
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

	// OIDC 발급자 서명(RS256) 토큰 생성 (TestJwtStrategy가 검증 가능)
	const token = signOidcTestToken({ sub: user.userId }, issuer);

	return {
		jwtToken: token,
		tenantId: formatDatabaseId(tenant.id),
		spaceId: formatDatabaseId(tenant.space.id),
		userId: formatDatabaseId(user.id),
	};
}

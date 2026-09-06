import type { OidcClient as PrismaOidcClient } from "@cocrepo/prisma";
import {
	BooleanValidation,
	ObjectValidationOptional,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** OidcClient의 DB 필드 타입과 공통 검증입니다. */
export class OidcClientSchema
	extends AbstractSchema
	implements PrismaOidcClient
{
	oidcClientId!: PrismaOidcClient["oidcClientId"];

	@StringValidation({
		description: "클라이언트 식별자",
		maxLength: 64,
		pattern: "^[a-z0-9-]+$",
		message: "Client ID는 영소문자, 숫자, 하이픈만 사용 가능합니다",
	})
	clientId!: PrismaOidcClient["clientId"];

	@StringValidationOptional({
		nullable: true,
		description: "클라이언트 시크릿",
	})
	clientSecret!: PrismaOidcClient["clientSecret"];

	@StringValidation({ description: "클라이언트 이름", maxLength: 128 })
	name!: PrismaOidcClient["name"];

	@StringValidation({ description: "리다이렉트 URI 목록", each: true })
	redirectUris!: PrismaOidcClient["redirectUris"];

	@StringValidationOptional({ nullable: true, description: "로그인 화면 URL" })
	loginUrl!: PrismaOidcClient["loginUrl"];

	@StringValidationOptional({
		nullable: true,
		description: "인증 성공 후 기본 복귀 URL",
	})
	defaultReturnTo!: PrismaOidcClient["defaultReturnTo"];

	@StringValidation({ description: "허용된 Grant 타입", each: true })
	grantTypes!: PrismaOidcClient["grantTypes"];

	@StringValidation({ description: "응답 타입", each: true })
	responseTypes!: PrismaOidcClient["responseTypes"];

	@StringValidation({ description: "토큰 엔드포인트 인증 방식", maxLength: 50 })
	tokenEndpointAuthMethod!: PrismaOidcClient["tokenEndpointAuthMethod"];

	@StringValidation({ description: "허용된 스코프" })
	scope!: PrismaOidcClient["scope"];

	@BooleanValidation({ description: "활성화 여부" })
	isActive!: PrismaOidcClient["isActive"];

	@BooleanValidation({ description: "First-party 클라이언트 여부" })
	isFirstParty!: PrismaOidcClient["isFirstParty"];

	@BooleanValidation({ description: "권한 동의 화면 생략 여부" })
	skipConsent!: PrismaOidcClient["skipConsent"];

	@ObjectValidationOptional()
	loginUi!: PrismaOidcClient["loginUi"];

	@StringValidationOptional({ nullable: true, description: "로고 URI" })
	logoUri!: PrismaOidcClient["logoUri"];

	@StringValidationOptional({ nullable: true, description: "정책 URI" })
	policyUri!: PrismaOidcClient["policyUri"];

	@StringValidationOptional({ nullable: true, description: "서비스 약관 URI" })
	tosUri!: PrismaOidcClient["tosUri"];
}

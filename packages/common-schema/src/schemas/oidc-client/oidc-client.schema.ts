import type { JsonValue } from "@cocrepo/type";
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
{
	oidcClientId!: string;

	@StringValidation({
		description: "클라이언트 식별자",
		maxLength: 64,
		pattern: "^[a-z0-9-]+$",
		message: "Client ID는 영소문자, 숫자, 하이픈만 사용 가능합니다",
	})
	clientId!: string;

	@StringValidationOptional({
		nullable: true,
		description: "클라이언트 시크릿",
	})
	clientSecret!: string | null;

	@StringValidation({ description: "클라이언트 이름", maxLength: 128 })
	name!: string;

	@StringValidation({ description: "리다이렉트 URI 목록", each: true })
	redirectUris!: string[];

	@StringValidationOptional({ nullable: true, description: "로그인 화면 URL" })
	loginUrl!: string | null;

	@StringValidationOptional({
		nullable: true,
		description: "인증 성공 후 기본 복귀 URL",
	})
	defaultReturnTo!: string | null;

	@StringValidation({ description: "허용된 Grant 타입", each: true })
	grantTypes!: string[];

	@StringValidation({ description: "응답 타입", each: true })
	responseTypes!: string[];

	@StringValidation({ description: "토큰 엔드포인트 인증 방식", maxLength: 50 })
	tokenEndpointAuthMethod!: string;

	@StringValidation({ description: "허용된 스코프" })
	scope!: string;

	@BooleanValidation({ description: "활성화 여부" })
	isActive!: boolean;

	@BooleanValidation({ description: "First-party 클라이언트 여부" })
	isFirstParty!: boolean;

	@BooleanValidation({ description: "권한 동의 화면 생략 여부" })
	skipConsent!: boolean;

	@ObjectValidationOptional()
	loginUi!: JsonValue;

	@StringValidationOptional({ nullable: true, description: "로고 URI" })
	logoUri!: string | null;

	@StringValidationOptional({ nullable: true, description: "정책 URI" })
	policyUri!: string | null;

	@StringValidationOptional({ nullable: true, description: "서비스 약관 URI" })
	tosUri!: string | null;
}

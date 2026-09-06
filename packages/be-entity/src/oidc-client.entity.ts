import {
	BooleanFieldMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { OidcClientSchema } from "@cocrepo/schema";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsObject, IsOptional } from "class-validator";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";

@AbstractEntityFields()
export class OidcClient extends OidcClientSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare oidcClientId: OidcClientSchema["oidcClientId"];

	@StringFieldMetadata({
		description: "클라이언트 식별자",
		maxLength: 64,
		pattern: "^[a-z0-9-]+$",
		message: "Client ID는 영소문자, 숫자, 하이픈만 사용 가능합니다",
	})
	declare clientId: OidcClientSchema["clientId"];
	@StringFieldOptionalMetadata({
		nullable: true,
		description: "클라이언트 시크릿",
	})
	declare clientSecret: OidcClientSchema["clientSecret"];
	@StringFieldMetadata({ description: "클라이언트 이름", maxLength: 128 })
	declare name: OidcClientSchema["name"];
	@StringFieldMetadata({ description: "리다이렉트 URI 목록", each: true })
	declare redirectUris: OidcClientSchema["redirectUris"];
	@StringFieldOptionalMetadata({
		nullable: true,
		description: "로그인 화면 URL",
	})
	declare loginUrl: OidcClientSchema["loginUrl"];
	@StringFieldOptionalMetadata({
		nullable: true,
		description: "인증 성공 후 기본 복귀 URL",
	})
	declare defaultReturnTo: OidcClientSchema["defaultReturnTo"];
	@StringFieldMetadata({ description: "허용된 Grant 타입", each: true })
	declare grantTypes: OidcClientSchema["grantTypes"];
	@StringFieldMetadata({ description: "응답 타입", each: true })
	declare responseTypes: OidcClientSchema["responseTypes"];
	@StringFieldMetadata({
		description: "토큰 엔드포인트 인증 방식",
		maxLength: 50,
	})
	declare tokenEndpointAuthMethod: OidcClientSchema["tokenEndpointAuthMethod"];
	@StringFieldMetadata({ description: "허용된 스코프" })
	declare scope: OidcClientSchema["scope"];
	@BooleanFieldMetadata({ description: "활성화 여부" })
	declare isActive: OidcClientSchema["isActive"];
	@BooleanFieldMetadata({ description: "First-party 클라이언트 여부" })
	declare isFirstParty: OidcClientSchema["isFirstParty"];
	@BooleanFieldMetadata({ description: "권한 동의 화면 생략 여부" })
	declare skipConsent: OidcClientSchema["skipConsent"];
	@ApiPropertyOptional({
		description: "로그인 화면 표시 설정",
		type: "object",
		additionalProperties: true,
		nullable: true,
	})
	@IsOptional()
	@IsObject()
	declare loginUi: OidcClientSchema["loginUi"];
	@StringFieldOptionalMetadata({ nullable: true, description: "로고 URI" })
	declare logoUri: OidcClientSchema["logoUri"];
	@StringFieldOptionalMetadata({ nullable: true, description: "정책 URI" })
	declare policyUri: OidcClientSchema["policyUri"];
	@StringFieldOptionalMetadata({
		nullable: true,
		description: "서비스 약관 URI",
	})
	declare tosUri: OidcClientSchema["tosUri"];

	isPublicClient(): boolean {
		return this.tokenEndpointAuthMethod === "none";
	}

	isConfidentialClient(): boolean {
		return this.tokenEndpointAuthMethod !== "none";
	}
}

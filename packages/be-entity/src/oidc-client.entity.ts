import {
	BooleanField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { JsonValue } from "@cocrepo/type";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsObject, IsOptional } from "class-validator";
import { AbstractEntity } from "./abstract.entity";

export class OidcClient extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	oidcClientId!: string;

	@StringField({
		description: "클라이언트 식별자",
		maxLength: 64,
		pattern: "^[a-z0-9-]+$",
		message: "Client ID는 영소문자, 숫자, 하이픈만 사용 가능합니다",
	})
	clientId!: string;
	@StringFieldOptional({ nullable: true, description: "클라이언트 시크릿" })
	clientSecret!: string | null;
	@StringField({ description: "클라이언트 이름", maxLength: 128 })
	name!: string;
	@StringField({ description: "리다이렉트 URI 목록", each: true })
	redirectUris!: string[];
	@StringFieldOptional({ nullable: true, description: "로그인 화면 URL" })
	loginUrl!: string | null;
	@StringFieldOptional({
		nullable: true,
		description: "인증 성공 후 기본 복귀 URL",
	})
	defaultReturnTo!: string | null;
	@StringField({ description: "허용된 Grant 타입", each: true })
	grantTypes!: string[];
	@StringField({ description: "응답 타입", each: true })
	responseTypes!: string[];
	@StringField({ description: "토큰 엔드포인트 인증 방식", maxLength: 50 })
	tokenEndpointAuthMethod!: string;
	@StringField({ description: "허용된 스코프" })
	scope!: string;
	@BooleanField({ description: "활성화 여부" })
	isActive!: boolean;
	@BooleanField({ description: "First-party 클라이언트 여부" })
	isFirstParty!: boolean;
	@BooleanField({ description: "권한 동의 화면 생략 여부" })
	skipConsent!: boolean;
	@ApiPropertyOptional({
		description: "로그인 화면 표시 설정",
		type: "object",
		additionalProperties: true,
		nullable: true,
	})
	@IsOptional()
	@IsObject()
	loginUi!: JsonValue | null;
	@StringFieldOptional({ nullable: true, description: "로고 URI" })
	logoUri!: string | null;
	@StringFieldOptional({ nullable: true, description: "정책 URI" })
	policyUri!: string | null;
	@StringFieldOptional({ nullable: true, description: "서비스 약관 URI" })
	tosUri!: string | null;

	isPublicClient(): boolean {
		return this.tokenEndpointAuthMethod === "none";
	}

	isConfidentialClient(): boolean {
		return this.tokenEndpointAuthMethod !== "none";
	}
}

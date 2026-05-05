import {
	BooleanField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator";
import type { OidcClient, Prisma } from "@cocrepo/prisma";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional } from "class-validator";

import { AbstractDto } from "../abstract.dto";

export class OidcClientDto extends AbstractDto implements OidcClient {
	@StringField({
		description: "클라이언트 식별자",
		maxLength: 64,
		pattern: "^[a-z0-9-]+$",
		message: "Client ID는 영소문자, 숫자, 하이픈만 사용 가능합니다",
	})
	clientId: string;

	@StringFieldOptional({ description: "클라이언트 시크릿" })
	clientSecret: string | null;

	@StringField({ description: "클라이언트 이름", maxLength: 128 })
	name: string;

	@StringField({
		description: "리다이렉트 URI 목록",
		each: true,
	})
	redirectUris: string[];

	@StringFieldOptional({ description: "로그인 셸 URL" })
	loginUrl: string | null;

	@StringFieldOptional({ description: "인증 성공 후 기본 복귀 URL" })
	defaultReturnTo: string | null;

	@StringField({
		description: "허용된 Grant 타입",
		each: true,
	})
	grantTypes: string[];

	@StringField({
		description: "응답 타입",
		each: true,
	})
	responseTypes: string[];

	@StringField({
		description: "토큰 엔드포인트 인증 방식",
		maxLength: 50,
	})
	tokenEndpointAuthMethod: string;

	@StringField({ description: "허용된 스코프" })
	scope: string;

	@BooleanField({ description: "활성화 여부" })
	isActive: boolean;

	@BooleanField({ description: "권한 동의 화면 생략 여부" })
	skipConsent: boolean;

	@ApiPropertyOptional({
		description: "로그인 화면 표시 설정",
		type: "object",
		additionalProperties: true,
		nullable: true,
	})
	@IsOptional()
	@IsObject()
	loginUi: Prisma.JsonValue | null;

	@StringFieldOptional({ description: "로고 URI" })
	logoUri: string | null;

	@StringFieldOptional({ description: "정책 URI" })
	policyUri: string | null;

	@StringFieldOptional({ description: "서비스 약관 URI" })
	tosUri: string | null;
}

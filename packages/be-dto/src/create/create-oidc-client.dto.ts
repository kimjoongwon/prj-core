import { BooleanFieldOptional } from "@cocrepo/decorator/field";
import { OmitType } from "@nestjs/swagger";

import { COMMON_ENTITY_FIELDS } from "../constant";
import { OidcClientDto } from "../oidc/oidc-client.dto";

/**
 * OIDC 클라이언트 생성 DTO
 * - clientId: 고유 식별자 (영소문자, 숫자, 하이픈)
 * - name: 표시 이름
 * - clientSecret: Confidential 클라이언트만 (Public은 null)
 * - redirectUris: 리다이렉트 URI 목록
 * - grantTypes: 허용할 Grant 타입
 * - isFirstParty: 관리자 지정 first-party 여부
 * - isActive는 자동으로 true 설정
 */
export class CreateOidcClientDto extends OmitType(OidcClientDto, [
	...COMMON_ENTITY_FIELDS,
	"isActive",
	"skipConsent",
]) {
	@BooleanFieldOptional({ description: "권한 동의 화면 생략 여부" })
	skipConsent?: boolean;
}

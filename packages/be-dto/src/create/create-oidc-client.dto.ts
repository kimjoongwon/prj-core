import { OidcClient } from "@cocrepo/entity";
import { IntersectionType, PartialType, PickType } from "@nestjs/swagger";

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
export class CreateOidcClientDto extends IntersectionType(
	PickType(OidcClient, [
		"clientId",
		"clientSecret",
		"name",
		"redirectUris",
		"loginUrl",
		"defaultReturnTo",
		"grantTypes",
		"responseTypes",
		"tokenEndpointAuthMethod",
		"scope",
		"isFirstParty",
		"loginUi",
		"logoUri",
		"policyUri",
		"tosUri",
	] as const),
	PartialType(PickType(OidcClient, ["skipConsent"] as const), {
		skipNullProperties: false,
	}),
) {}

import { OidcClient } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

/**
 * OIDC 클라이언트 수정 DTO
 * - clientId는 수정 불가
 * - 나머지 필드는 모두 선택적
 */
export class UpdateOidcClientDto extends PartialType(
	PickType(OidcClient, [
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
		"skipConsent",
	] as const),
) {}

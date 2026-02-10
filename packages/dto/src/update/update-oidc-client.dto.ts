import { OmitType, PartialType } from "@nestjs/swagger";

import { CreateOidcClientDto } from "../create/create-oidc-client.dto";

/**
 * OIDC 클라이언트 수정 DTO
 * - clientId는 수정 불가
 * - 나머지 필드는 모두 선택적
 */
export class UpdateOidcClientDto extends PartialType(
	OmitType(CreateOidcClientDto, ["clientId"]),
) {}

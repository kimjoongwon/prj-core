import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { RoleDto } from "../role.dto";

/**
 * 역할 생성 DTO
 * - name: 역할 식별자 (영문 대문자, 언더스코어만 허용)
 * - displayName: 표시명
 * - description: 설명 (선택)
 */
export class CreateRoleDto extends OmitType(RoleDto, [
	...COMMON_ENTITY_FIELDS,
	"classification",
	"associations",
]) {}

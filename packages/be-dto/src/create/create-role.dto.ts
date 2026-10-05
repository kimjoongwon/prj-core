import { Role } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

/**
 * 역할 생성 DTO
 * - name: 역할 식별자 (영문 대문자, 언더스코어만 허용)
 * - displayName: 표시명
 * - description: 설명 (선택)
 */
export class CreateRoleDto extends PickType(Role, [
	"name",
	"displayName",
	"description",
] as const) {}

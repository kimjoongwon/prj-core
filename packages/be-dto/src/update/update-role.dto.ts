import { Role } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

/**
 * 역할 수정 DTO
 * - displayName: 표시명 (선택)
 * - description: 설명 (선택)
 * - name은 수정 불가
 */
export class UpdateRoleDto extends PartialType(
	PickType(Role, ["displayName", "description"] as const),
) {}

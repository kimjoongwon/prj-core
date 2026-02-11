import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateRoleDto } from "../create/create-role.dto";

/**
 * 역할 수정 DTO
 * - displayName: 표시명 (선택)
 * - description: 설명 (선택)
 * - name은 수정 불가
 */
export class UpdateRoleDto extends PartialType(
	OmitType(CreateRoleDto, ["name"]),
) {}

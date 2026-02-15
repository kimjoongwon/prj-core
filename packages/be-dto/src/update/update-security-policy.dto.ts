import { OmitType, PartialType } from "@nestjs/swagger";
import { SecurityPolicyDto } from "../security-policy.dto";

/**
 * 보안 정책 수정 DTO
 * - key, id, createdAt, updatedAt은 수정 불가
 * - 나머지 필드는 모두 선택적
 */
export class UpdateSecurityPolicyDto extends PartialType(
	OmitType(SecurityPolicyDto, ["id", "createdAt", "updatedAt", "key"]),
) {}

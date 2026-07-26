import { TenantDto } from "../tenant.dto";

/**
 * 사용자에게 속한 Tenant의 상세 응답입니다.
 *
 * Role의 정책 할당과 Policy의 권한 항목을 포함할 수 있습니다.
 */
export class UserTenantDetailResponseDto extends TenantDto {}

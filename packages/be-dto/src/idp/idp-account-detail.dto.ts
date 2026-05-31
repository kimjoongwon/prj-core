import { ClassField } from "@cocrepo/decorator";
import { IdpAccountDto } from "./idp-account/idp-account.dto";
import { IdpAccountAccessGrantDto } from "./idp-account-access-grant.dto";

/**
 * IDP 계정 상세 DTO (접근 권한 포함)
 */
export class IdpAccountDetailDto extends IdpAccountDto {
	@ClassField(() => IdpAccountAccessGrantDto, {
		each: true,
		isArray: true,
		description: "계정에 부여된 Space/Role 접근 권한 목록",
	})
	accessGrants!: IdpAccountAccessGrantDto[];
}

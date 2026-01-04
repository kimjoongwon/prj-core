import { ClassField } from "@cocrepo/decorator";
import { UserDto } from "../user.dto";

/**
 * 회원 상세 응답 DTO
 * Profile, Tenant, Role, Space 정보를 포함한 상세 회원 정보
 */
export class UserDetailResponseDto extends UserDto {
	// UserDto에 이미 profiles, tenants, associations, classification이 포함되어 있음
	// 필요시 추가 필드를 여기에 정의
}

/**
 * 회원 상세 조회 래퍼 응답 DTO
 */
export class UserDetailWrapperResponseDto {
	@ClassField(() => UserDetailResponseDto, {
		description: "회원 상세 정보",
	})
	data: UserDetailResponseDto;
}

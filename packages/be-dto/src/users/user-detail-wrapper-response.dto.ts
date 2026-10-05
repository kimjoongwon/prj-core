import { ClassField } from "@cocrepo/decorator/field";

import { UserDetailResponseDto } from "./user-detail-response/user-detail-response.dto";

/**
 * 회원 상세 조회 래퍼 응답 DTO
 */
export class UserDetailWrapperResponseDto {
	@ClassField(() => UserDetailResponseDto, {
		description: "회원 상세 정보-",
	})
	data: UserDetailResponseDto;
}

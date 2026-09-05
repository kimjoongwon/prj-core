import {
	BigIntIdFieldOptional,
	PhoneFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { User } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

/**
 * 회원 수정용 DTO
 * 관리자가 회원 정보를 수정할 때 사용합니다.
 */
export class UpdateUserMemberDto extends PartialType(
	PickType(User, ["email"] as const),
	{ skipNullProperties: false },
) {
	@StringFieldOptional({
		minLength: 2,
		maxLength: 50,
		description: "사용자 이름",
	})
	name?: string;

	@PhoneFieldOptional({
		description: "전화번호 (한국 휴대폰 형식)",
	})
	phone?: string;

	@BigIntIdFieldOptional({
		description: "분류 카테고리 ID",
	})
	categoryId?: bigint;

	@BigIntIdFieldOptional({
		each: true,
		description: "그룹 ID 목록",
	})
	groupIds?: bigint[];
}

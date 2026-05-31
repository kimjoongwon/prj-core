import { StringField, StringFieldOptional } from "@cocrepo/decorator";

/**
 * 로그인 실패 후 사용 가능한 복구 액션
 */
export class LoginRecoveryActionDto {
	@StringField({ description: "액션 코드" })
	type!: string;

	@StringField({ description: "사용자 표시 라벨" })
	label!: string;

	@StringFieldOptional({ description: "이동 경로" })
	href?: string;
}

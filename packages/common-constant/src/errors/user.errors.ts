import { createEntityErrors } from "./create-errors";

export const USER_ERRORS = createEntityErrors("사용자", {
	EMAIL_ALREADY_EXISTS: "이미 사용 중인 이메일입니다",
	PHONE_ALREADY_EXISTS: "이미 사용 중인 전화번호입니다",
	NAME_ALREADY_EXISTS: "이미 사용 중인 이름입니다",
	CANNOT_DELETE_SELF: "자신의 계정은 삭제할 수 없습니다",
});

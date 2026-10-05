import { createDomainErrors } from "./create-errors";

export const EXERCISE_ERRORS = createDomainErrors("운동 종목", {
	EXERCISE_NOT_FOUND: "운동 종목을 찾을 수 없습니다",
	EXERCISE_NOT_OWNED: "현재 Space가 소유한 운동 종목이 아닙니다",
	EXERCISE_IN_USE: "Activity에서 사용 중인 운동 종목은 삭제할 수 없습니다",
});

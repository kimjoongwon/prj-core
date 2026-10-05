import { createDomainErrors } from "./create-errors";

export const ROUTINE_ERRORS = createDomainErrors("루틴", {
	ROUTINE_NOT_FOUND: "루틴을 찾을 수 없습니다",
	ROUTINE_NOT_OWNED: "현재 Space가 소유한 루틴이 아닙니다",
	ROUTINE_IN_USE: "Program에서 사용 중인 루틴은 삭제할 수 없습니다",
	ROUTINE_ACTIVITY_TASK_DUPLICATED:
		"루틴 활동에는 중복된 Task를 포함할 수 없습니다",
	TASK_EXERCISE_NOT_SCHEDULABLE: "영상이 없는 운동은 루틴에 편성할 수 없습니다",
});

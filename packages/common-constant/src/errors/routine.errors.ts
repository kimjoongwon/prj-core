import { createDomainErrors } from "./create-errors";

export const ROUTINE_ERRORS = createDomainErrors("루틴", {
	ROUTINE_NOT_FOUND: "루틴을 찾을 수 없습니다",
	ROUTINE_NOT_OWNED: "현재 Space가 소유한 루틴이 아닙니다",
	ROUTINE_IN_USE: "Program에서 사용 중인 루틴은 삭제할 수 없습니다",
});

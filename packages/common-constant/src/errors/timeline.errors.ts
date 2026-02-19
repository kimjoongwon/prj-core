import { createDomainErrors } from "./create-errors";

export const TIMELINE_ERRORS = createDomainErrors("타임라인", {
	TIMELINE_NOT_FOUND: "타임라인을 찾을 수 없습니다",
	TIMELINE_NAME_DUPLICATED: "같은 Space 내에 동일한 이름의 타임라인이 존재합니다",
	TIMELINE_HAS_SESSIONS: "세션이 있는 타임라인은 삭제할 수 없습니다",
	SESSION_NOT_FOUND: "세션을 찾을 수 없습니다",
	SESSION_HAS_PROGRAMS: "프로그램이 연결된 세션은 삭제할 수 없습니다",
	SESSION_DATE_INVALID: "세션 날짜가 유효하지 않습니다. 종료일은 시작일 이후여야 합니다",
	PROGRAM_NOT_FOUND: "프로그램을 찾을 수 없습니다",
	PROGRAM_ROUTINE_DUPLICATED: "같은 세션 내에 동일한 루틴의 프로그램이 이미 존재합니다",
});

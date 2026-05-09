import { createDomainErrors } from "./create-errors";

export const COURSE_ERRORS = createDomainErrors("코스", {
	SPACE_NOT_SELECTED: "코스를 관리할 Space가 선택되지 않았습니다",
	SPACE_ACCESS_REQUIRED: "현재 Space의 코스 관리 권한이 없습니다",
	COURSE_NOT_FOUND: "코스를 찾을 수 없습니다",
	COURSE_NOT_OWNED: "현재 Space가 소유한 코스가 아닙니다",
	COURSE_HAS_ACTIVE_ENROLLMENTS:
		"활성 수강 등록이 있는 코스는 삭제할 수 없습니다",
	COURSE_OFFERING_NOT_FOUND: "코스 개설을 찾을 수 없습니다",
	COURSE_OFFERING_SCOPE_INVALID:
		"코스, Space, Timeline 연결 범위가 유효하지 않습니다",
	COURSE_OFFERING_DATE_INVALID:
		"코스 개설 날짜가 유효하지 않습니다. 종료일은 시작일 이후여야 합니다",
	COURSE_OFFERING_CAPACITY_EXCEEDED:
		"코스 개설 정원을 초과하여 등록할 수 없습니다",
	ENROLLMENT_NOT_FOUND: "수강 등록을 찾을 수 없습니다",
	ENROLLMENT_SCOPE_INVALID: "수강 등록의 코스 개설 연결이 유효하지 않습니다",
	ENROLLMENT_PASS_TIMELINE_REQUIRED:
		"수강권 발급에는 배정 Timeline 또는 코스 개설 Timeline이 필요합니다",
	COURSE_PASS_NOT_FOUND: "수강권을 찾을 수 없습니다",
	COURSE_PASS_REQUIRED: "예약하려면 수강권이 필요합니다",
	COURSE_PASS_USER_MISMATCH: "현재 사용자의 수강권이 아닙니다",
	COURSE_PASS_SPACE_MISMATCH: "현재 Space에서 사용할 수 없는 수강권입니다",
	COURSE_PASS_TIMELINE_MISMATCH:
		"선택한 Timeline에서 사용할 수 없는 수강권입니다",
	COURSE_PASS_INACTIVE: "활성 상태의 수강권이 아닙니다",
	COURSE_PASS_NOT_YET_VALID: "아직 사용할 수 없는 수강권입니다",
	COURSE_PASS_EXPIRED: "만료된 수강권입니다",
	COURSE_PASS_NO_REMAINING: "남은 예약권이 없습니다",
});

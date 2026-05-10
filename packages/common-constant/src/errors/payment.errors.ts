import { createDomainErrors } from "./create-errors";

export const PAYMENT_ERRORS = createDomainErrors("결제", {
	SPACE_NOT_SELECTED: "결제를 관리할 Space가 선택되지 않았습니다",
	SPACE_ACCESS_REQUIRED: "현재 Space의 결제 관리 권한이 없습니다",
	PAYMENT_NOT_FOUND: "결제를 찾을 수 없습니다",
	PAYMENT_SUBJECT_REQUIRED: "결제 대상이 최소 1개 필요합니다",
	PAYMENT_AMOUNT_INVALID: "결제 금액이 유효하지 않습니다",
	PAYMENT_SUBJECT_SPACE_MISMATCH:
		"결제 대상은 결제와 같은 Space에 기록되어야 합니다",
	PAYMENT_REFERENCE_SPACE_MISMATCH:
		"결제 참조는 결제와 같은 Space에 기록되어야 합니다",
	RESERVATION_CHECKOUT_ACTIVE_PASS_EXISTS:
		"이미 예약 가능한 수강권이 있어 결제 체크아웃이 필요하지 않습니다",
	RESERVATION_CHECKOUT_OFFERING_NOT_FOUND:
		"예약 결제에 사용할 수강 상품을 찾을 수 없습니다",
	RESERVATION_CHECKOUT_PROGRAM_NOT_FOUND:
		"예약 결제에 사용할 클래스 회차를 찾을 수 없습니다",
});

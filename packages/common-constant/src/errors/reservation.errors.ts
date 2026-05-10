import { createDomainErrors } from "./create-errors";

export const RESERVATION_ERRORS = createDomainErrors("예약", {
	SPACE_NOT_SELECTED: "예약할 Space가 선택되지 않았습니다",
	USER_NOT_AUTHENTICATED: "예약하려면 인증이 필요합니다",
	SPACE_ACCESS_REQUIRED: "현재 Space 예약 권한이 없습니다",
	CONNECTION_INVALID: "예약 대상 일정 연결이 유효하지 않습니다",
	PROGRAM_NOT_FOUND: "예약할 프로그램을 찾을 수 없습니다",
	CHECKOUT_OPTION_NOT_FOUND: "예약 결제에 사용할 수 있는 과정이 없습니다",
	CHECKOUT_PAYMENT_METHOD_INVALID: "지원하지 않는 예약 결제 수단입니다",
	RESERVATION_NOT_FOUND: "예약을 찾을 수 없습니다",
	ACTIVE_DUPLICATE: "이미 활성 예약이 존재합니다",
	ALREADY_CANCELED: "이미 취소된 예약입니다",
	CANCEL_CUTOFF_PASSED: "예약 취소 가능 시간이 지났습니다",
});

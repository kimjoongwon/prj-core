import { createEntityErrors } from "./create-errors";

export const AUTH_ERRORS = createEntityErrors("인증", {
  REFRESH_TOKEN_NOT_FOUND: "리프레시 토큰이 존재하지 않습니다",
  TOKEN_INVALID: "토큰이 유효하지 않습니다",
  INVALID_SIGNUP_FORMAT: "입력 형식이 올바르지 않습니다",
  EMAIL_ALREADY_EXISTS: "이미 사용 중인 이메일입니다",
  OIDC_CALLBACK_FAILED: "OIDC 인증 콜백 처리에 실패했습니다",
  OIDC_STATE_MISMATCH: "OIDC state 검증에 실패했습니다",
});

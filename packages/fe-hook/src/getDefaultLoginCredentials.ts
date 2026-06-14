import {
	LOCAL_LOGIN_EMAIL,
	LOCAL_LOGIN_PASSWORD,
} from "./auth-login.constants";

/**
 * 실행 환경에 맞는 로그인 폼 기본값을 반환합니다.
 */
export function getDefaultLoginCredentials(nodeEnv = process.env.NODE_ENV) {
	if (nodeEnv !== "development") {
		return {
			email: "",
			password: "",
		};
	}

	return {
		email: LOCAL_LOGIN_EMAIL,
		password: LOCAL_LOGIN_PASSWORD,
	};
}

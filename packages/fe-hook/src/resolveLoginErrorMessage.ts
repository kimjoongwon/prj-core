import type { ApiDatabaseError } from "@cocrepo/type";

const DEFAULT_LOGIN_ERROR_MESSAGE = "로그인에 실패했습니다.";
const DATABASE_SCHEMA_ERROR_MESSAGE =
	"서버가 최신 상태로 준비되지 않았습니다. 잠시 후 다시 시도하거나 관리자에게 문의해 주세요.";

interface LoginErrorResponse {
	message?: string | string[];
	displayMessage?: string;
	data?: {
		displayMessage?: string;
		message?: string | string[];
	} & ApiDatabaseError;
}

/**
 * 문자열 또는 문자열 배열 메시지를 단일 메시지로 정규화합니다.
 */
function normalizeMessage(message?: string | string[]) {
	if (Array.isArray(message)) {
		return message[0];
	}

	return message;
}

/**
 * native login API error shape를 사용자 표시 메시지로 변환합니다.
 */
export function resolveLoginErrorMessage(error: unknown) {
	const responseData = (
		error as {
			response?: {
				data?: LoginErrorResponse;
			};
			message?: string;
		}
	).response?.data;
	const databaseError = responseData?.data as
		| (ApiDatabaseError & {
				displayMessage?: string;
				message?: string | string[];
		  })
		| undefined;

	if (databaseError?.code === "P2022") {
		return DATABASE_SCHEMA_ERROR_MESSAGE;
	}

	return (
		responseData?.data?.displayMessage ??
		normalizeMessage(responseData?.data?.message) ??
		responseData?.displayMessage ??
		normalizeMessage(responseData?.message) ??
		(error as { message?: string }).message ??
		DEFAULT_LOGIN_ERROR_MESSAGE
	);
}

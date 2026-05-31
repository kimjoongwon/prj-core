const DEFAULT_LOGIN_ERROR_MESSAGE = "로그인에 실패했습니다.";

interface LoginErrorResponse {
	message?: string | string[];
	displayMessage?: string;
	data?: {
		displayMessage?: string;
		message?: string | string[];
	};
}

function normalizeMessage(message?: string | string[]) {
	if (Array.isArray(message)) {
		return message[0];
	}

	return message;
}

export function resolveLoginErrorMessage(error: unknown) {
	const responseData = (
		error as {
			response?: {
				data?: LoginErrorResponse;
			};
			message?: string;
		}
	).response?.data;

	return (
		responseData?.data?.displayMessage ??
		normalizeMessage(responseData?.data?.message) ??
		responseData?.displayMessage ??
		normalizeMessage(responseData?.message) ??
		(error as { message?: string }).message ??
		DEFAULT_LOGIN_ERROR_MESSAGE
	);
}

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * OIDC 기반 로그인 페이지 훅
 *
 * 페이지 진입 시 즉시 IDP의 OIDC Authorization 엔드포인트로 리다이렉트합니다.
 * OIDC 콜백 에러가 있을 경우에만 에러 메시지를 표시합니다.
 */
export const useAuthLoginPage = () => {
	const searchParams = useSearchParams();
	const errorFromCallback = searchParams.get("error");

	useEffect(() => {
		if (!errorFromCallback) {
			window.location.href = "/api/v1/auth/login";
		}
	}, [errorFromCallback]);

	const onClickRetry = () => {
		window.location.href = "/api/v1/auth/login";
	};

	return {
		errorMessage: errorFromCallback || "",
		isRedirecting: !errorFromCallback,
		onClickRetry,
	};
};

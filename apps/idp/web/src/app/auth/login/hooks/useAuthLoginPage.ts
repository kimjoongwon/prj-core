import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * OIDC 기반 로그인 페이지 훅
 *
 * 페이지 진입 시 즉시 IDP의 OIDC Authorization 엔드포인트로 리다이렉트합니다.
 * returnTo 파라미터로 인증 완료 후 IDP 콘솔로 돌아올 수 있도록 합니다.
 * OIDC 콜백 에러가 있을 경우에만 에러 메시지를 표시합니다.
 */
export const useAuthLoginPage = () => {
	const searchParams = useSearchParams();
	const errorFromCallback = searchParams.get("error");

	const createLoginUrl = () => {
		if (typeof window === "undefined") {
			return "/api/v1/auth/login";
		}

		// IDP 콘솔 기본 페이지로 돌아가도록 returnTo 설정
		const returnTo = `${window.location.origin}/oidc-clients`;
		return `/api/v1/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
	};

	useEffect(() => {
		if (!errorFromCallback) {
			window.location.href = createLoginUrl();
		}
	}, [errorFromCallback]);

	const onClickRetry = () => {
		window.location.href = createLoginUrl();
	};

	return {
		errorMessage: errorFromCallback || "",
		isRedirecting: !errorFromCallback,
		onClickRetry,
	};
};

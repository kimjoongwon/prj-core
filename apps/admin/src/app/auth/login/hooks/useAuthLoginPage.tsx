import type { LoginPageState } from "@cocrepo/ui";
import { useLocalObservable } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * OIDC 기반 로그인 페이지 훅
 *
 * IDP의 OIDC Authorization 엔드포인트로 리다이렉트하여 로그인을 처리합니다.
 * 실제 로그인 폼은 IDP의 login.ejs 템플릿에서 제공됩니다.
 */
export const useAuthLoginPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const errorFromCallback = searchParams.get("error");

	const state = useLocalObservable<LoginPageState>(() => ({
		email: "",
		password: "",
		errorMessage: errorFromCallback || "",
	}));

	const onClickLoginButton = () => {
		state.errorMessage = "";

		// Server의 OIDC login 엔드포인트로 리다이렉트
		// Server가 IDP의 Authorization URL로 다시 리다이렉트
		window.location.href = "/api/v1/auth/login";
	};

	const onKeyDownInput = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			onClickLoginButton();
		}
	};

	return {
		state,
		onClickLoginButton,
		onKeyDownInput,
		isLoading: false,
	};
};

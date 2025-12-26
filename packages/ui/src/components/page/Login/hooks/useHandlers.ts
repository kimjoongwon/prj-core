import type React from "react";
import { useCallback } from "react";

interface LoginState {
	email: string;
	password: string;
	errorMessage: string;
}

interface LoginMutation {
	mutateAsync: (params: {
		data: { email: string; password: string };
	}) => Promise<unknown>;
	isPending: boolean;
}

interface Router {
	push: (path: string) => void;
}

interface UseHandlersParams {
	state: LoginState;
	loginMutation: LoginMutation;
	router: Router;
}

export const useHandlers = ({
	state,
	loginMutation,
	router,
}: UseHandlersParams) => {
	const onClickLoginButton = useCallback(async () => {
		state.errorMessage = "";

		if (!state.email || !state.password) {
			state.errorMessage = "이메일과 비밀번호를 입력해주세요.";
			return;
		}

		try {
			await loginMutation.mutateAsync({
				data: {
					email: state.email,
					password: state.password,
				},
			});

			// 로그인 성공 시 대시보드로 이동
			router.push("/");
		} catch (_error) {
			state.errorMessage =
				"로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
		}
	}, [loginMutation, router, state]);

	const onKeyDownInput = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				onClickLoginButton();
			}
		},
		[onClickLoginButton],
	);

	return {
		onClickLoginButton,
		onKeyDownInput,
	};
};

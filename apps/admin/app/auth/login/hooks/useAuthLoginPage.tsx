import { useLogin } from "@cocrepo/api";
import type { LoginPageState } from "@cocrepo/ui";
import { useLocalObservable } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback } from "react";

// 로그인 페이지에 필요한 모든 속성을 생성하는 훅
export const useAuthLoginPage = () => {
	const router = useRouter();
	const loginMutation = useLogin();

	const state = useLocalObservable<LoginPageState>(() => ({
		email: "",
		password: "",
		errorMessage: "",
	}));

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
		state,
		onClickLoginButton,
		onKeyDownInput,
		isLoading: loginMutation.isPending,
	};
};

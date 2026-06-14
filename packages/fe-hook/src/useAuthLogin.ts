"use client";

import { useNativeLogin } from "@cocrepo/api/idp/auth";
import { usePersistStore } from "@cocrepo/store";
import { useLocalObservable } from "mobx-react-lite";
import { getDefaultLoginCredentials } from "./getDefaultLoginCredentials";
import { resolveLoginErrorMessage } from "./resolveLoginErrorMessage";
import { resolveReturnPath } from "./resolveReturnPath";

export interface AuthLoginRouter {
	replace: (href: string) => void;
}

export interface UseAuthLoginOptions {
	router: AuthLoginRouter;
}

/**
 * native email/password login 화면의 상태와 submit handler를 제공합니다.
 */
export function useAuthLogin({ router }: UseAuthLoginOptions) {
	const persistStore = usePersistStore();
	const defaultLoginCredentials = getDefaultLoginCredentials();
	const state = useLocalObservable(() => ({
		loginForm: {
			email: defaultLoginCredentials.email,
			password: defaultLoginCredentials.password,
		},
		errorMessage: "",
	}));
	const { mutateAsync: nativeLogin, isPending } = useNativeLogin();

	/**
	 * 현재 로그인 폼 값으로 native login을 요청하고 세션 저장 후 안전한 return path로 이동합니다.
	 */
	const onSubmitLoginForm = async () => {
		state.errorMessage = "";

		try {
			const response = await nativeLogin({
				data: {
					email: state.loginForm.email,
					password: state.loginForm.password,
				},
			});
			const session = response.data;
			if (!session) {
				state.errorMessage = "로그인 응답이 올바르지 않습니다.";
				return;
			}

			persistStore.setNativeAuthSession(session);
			persistStore.setSpaceSelectionResolved(false);
			router.replace(resolveReturnPath());
		} catch (error) {
			state.errorMessage = resolveLoginErrorMessage(error);
		}
	};

	return {
		state,
		isLoading: isPending,
		onSubmitLoginForm,
	};
}

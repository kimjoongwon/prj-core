import { useNativeLogin } from "@cocrepo/api/idp/auth";
import { useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { usePersistStore } from "@/stores/AppStoreProvider";
import { resolveLoginErrorMessage } from "./resolveLoginErrorMessage";
import { resolveReturnPath } from "./resolveReturnPath";

export const useAuthLoginPage = () => {
	const router = useRouter();
	const persistStore = usePersistStore();
	const state = useLocalObservable(() => ({
		loginForm: {
			email: "",
			password: "",
		},
		errorMessage: "",
	}));
	const { mutateAsync: nativeLogin, isPending } = useNativeLogin();

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
			router.replace(resolveReturnPath() as Route);
		} catch (error) {
			state.errorMessage = resolveLoginErrorMessage(error);
		}
	};

	return {
		state,
		isLoading: isPending,
		onSubmitLoginForm,
	};
};

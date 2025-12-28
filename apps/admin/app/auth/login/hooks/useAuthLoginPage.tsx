import { useLogin } from "@cocrepo/api";
import { LoginSchema, validateSchema } from "@cocrepo/schema";
import type { LoginPageState } from "@cocrepo/ui";
import { useLocalObservable } from "mobx-react-lite";
import { useRouter } from "next/navigation";

// 로그인 페이지에 필요한 모든 속성을 생성하는 훅
export const useAuthLoginPage = () => {
	const router = useRouter();
	const loginMutation = useLogin();

	const state = useLocalObservable<LoginPageState>(() => ({
		email: "",
		password: "",
		errorMessage: "",
	}));

	const onClickLoginButton = async () => {
		state.errorMessage = "";

		// @cocrepo/schema를 이용한 검증
		const result = await validateSchema(LoginSchema, {
			email: state.email,
			password: state.password,
		});

		if (!result.isValid) {
			state.errorMessage = result.errors[0].messages[0];
			return;
		}

		try {
			await loginMutation.mutateAsync({
				data: {
					email: result.data.email,
					password: result.data.password,
				},
			});

			// 로그인 성공 시 대시보드로 이동
			router.push("/");
		} catch (_error) {
			state.errorMessage =
				"로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
		}
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
		isLoading: loginMutation.isPending,
	};
};

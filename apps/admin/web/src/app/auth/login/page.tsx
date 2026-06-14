"use client";

import { useAuthLogin } from "@cocrepo/hook";
import { LoginScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

function AuthLoginPage() {
	const router = useRouter();
	/**
	 * useAuthLogin의 string return path를 Next typed router에 전달합니다.
	 */
	const authLoginRouter = {
		replace: (href: string) =>
			router.replace(href as Parameters<typeof router.replace>[0]),
	};
	const { state, isLoading, onSubmitLoginForm } = useAuthLogin({
		router: authLoginRouter,
	});

	return (
		<LoginScreen
			state={state}
			title="관리자 로그인"
			caption="예약, 결제, 권한 상태를 이어서 확인하세요."
			onSubmitLoginForm={onSubmitLoginForm}
			isLoading={isLoading}
		/>
	);
}

export default observer(AuthLoginPage);

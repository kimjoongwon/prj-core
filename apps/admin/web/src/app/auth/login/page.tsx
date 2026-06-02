"use client";

import { LoginPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useAuthLoginPage } from "./hooks";

function AuthLoginPage() {
	const { state, isLoading, onSubmitLoginForm } = useAuthLoginPage();

	return (
		<LoginPage
			state={state}
			title="관리자 로그인"
			caption="예약, 결제, 권한 상태를 이어서 확인하세요."
			onSubmitLoginForm={onSubmitLoginForm}
			isLoading={isLoading}
		/>
	);
}

export default observer(AuthLoginPage);

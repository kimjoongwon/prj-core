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
			caption="관리자 계정으로 로그인해주세요."
			onSubmitLoginForm={onSubmitLoginForm}
			isLoading={isLoading}
		/>
	);
}

export default observer(AuthLoginPage);

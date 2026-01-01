"use client";

import { LoginPage } from "@cocrepo/ui";

import { useAuthLoginPage } from "./hooks";

const Page = () => {
	const { state, onClickLoginButton, onKeyDownInput, isLoading } =
		useAuthLoginPage();

	return (
		<LoginPage
			state={state}
			onClickLoginButton={onClickLoginButton}
			onKeyDownInput={onKeyDownInput}
			isLoading={isLoading}
			title="관리자 로그인"
			caption="관리자 계정으로 로그인하세요"
		/>
	);
};

export default Page;

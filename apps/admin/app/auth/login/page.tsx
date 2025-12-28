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
		/>
	);
};

export default Page;

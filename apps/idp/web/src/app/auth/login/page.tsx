"use client";

import type { LanguageCode } from "@cocrepo/constant";
import { useConsoleLocaleStore } from "@cocrepo/store";
import { IdentityLoginRedirectPage, LanguageSelectButton } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { Suspense } from "react";
import { useAuthLoginPage } from "./hooks";

const LoginLanguageSelect = observer(function LoginLanguageSelect() {
	const localeStore = useConsoleLocaleStore();

	const onChangeLanguage = (languageCode: LanguageCode) => {
		localeStore.setLanguageCode(languageCode);
	};

	return (
		<LanguageSelectButton
			value={localeStore.languageCode}
			onChange={onChangeLanguage}
		/>
	);
});

const LoginContent = observer(() => {
	const { errorMessage, isRedirecting, onClickRetry } = useAuthLoginPage();

	return (
		<IdentityLoginRedirectPage
			errorMessage={errorMessage}
			isRedirecting={isRedirecting}
			onClickRetry={onClickRetry}
			topActions={<LoginLanguageSelect />}
		/>
	);
});

function AuthLoginPage() {
	return (
		<Suspense
			fallback={
				<IdentityLoginRedirectPage
					errorMessage=""
					isRedirecting
					onClickRetry={undefined}
					topActions={<LoginLanguageSelect />}
				/>
			}
		>
			<LoginContent />
		</Suspense>
	);
}

export default observer(AuthLoginPage);

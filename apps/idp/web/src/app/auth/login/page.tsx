"use client";

import { IdentityLoginRedirectPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { Suspense } from "react";
import { useAuthLoginPage } from "./hooks";

const LoginContent = observer(() => {
	const { errorMessage, isRedirecting, onClickRetry } = useAuthLoginPage();

	return (
		<IdentityLoginRedirectPage
			errorMessage={errorMessage}
			isRedirecting={isRedirecting}
			onClickRetry={onClickRetry}
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
				/>
			}
		>
			<LoginContent />
		</Suspense>
	);
}

export default observer(AuthLoginPage);

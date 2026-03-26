"use client";

import { useRequestPasswordReset } from "@cocrepo/api/idp/password-reset";
import { IdpForgotPasswordPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

const ForgotPasswordPage = observer(function ForgotPasswordPage() {
	const resetMutation = useRequestPasswordReset();

	const onSubmitForgotPasswordForm = async (email: string) => {
		try {
			await resetMutation.mutateAsync({ data: { email } });
			return null;
		} catch {
			return "서버와 통신할 수 없습니다.";
		}
	};

	return <IdpForgotPasswordPage onSubmit={onSubmitForgotPasswordForm} />;
});

export default ForgotPasswordPage;

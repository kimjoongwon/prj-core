"use client";

import { useRequestPasswordReset } from "@cocrepo/api/idp/password-reset";
import { ForgotPasswordPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

const ForgotPasswordRoutePage = observer(function ForgotPasswordRoutePage() {
	const resetMutation = useRequestPasswordReset();

	const onSubmitForgotPasswordForm = async (email: string) => {
		try {
			await resetMutation.mutateAsync({ data: { email } });
			return null;
		} catch {
			return "서버와 통신할 수 없습니다.";
		}
	};

	return <ForgotPasswordPage onSubmit={onSubmitForgotPasswordForm} />;
});

export default ForgotPasswordRoutePage;

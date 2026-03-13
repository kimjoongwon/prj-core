"use client";
import { useRequestPasswordReset } from "@cocrepo/api/idp/password-reset";

import { observer } from "mobx-react-lite";
import { ForgotPasswordForm } from "../../../widget/form/ForgotPasswordForm/ForgotPasswordForm";

/**
 * IDP 비밀번호 찾기 Feature
 *
 * ForgotPasswordForm Widget에 실제 API 호출 로직을 연결합니다.
 */
export const IdpForgotPassword = observer(() => {
	const resetMutation = useRequestPasswordReset();

	const handleSubmit = async (email: string): Promise<string | null> => {
		try {
			await resetMutation.mutateAsync({ data: { email } });
			return null;
		} catch {
			return "서버와 통신할 수 없습니다.";
		}
	};

	return <ForgotPasswordForm onSubmit={handleSubmit} />;
});

IdpForgotPassword.displayName = "IdpForgotPassword";

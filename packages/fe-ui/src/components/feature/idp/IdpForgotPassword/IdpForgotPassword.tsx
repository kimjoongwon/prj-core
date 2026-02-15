"use client";

import { observer } from "mobx-react-lite";
import { ForgotPasswordForm } from "../../../widget/form/ForgotPasswordForm/ForgotPasswordForm";

/**
 * IDP 비밀번호 찾기 Feature
 *
 * ForgotPasswordForm Widget에 실제 API 호출 로직을 연결합니다.
 */
export const IdpForgotPassword = observer(() => {
	const handleSubmit = async (email: string): Promise<string | null> => {
		try {
			const response = await fetch("/api/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			if (!response.ok) {
				return "요청 처리 중 오류가 발생했습니다.";
			}

			return null;
		} catch {
			return "서버와 통신할 수 없습니다.";
		}
	};

	return <ForgotPasswordForm onSubmit={handleSubmit} />;
});

IdpForgotPassword.displayName = "IdpForgotPassword";

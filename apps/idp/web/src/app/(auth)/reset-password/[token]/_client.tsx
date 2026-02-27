"use client";

import { IdpResetPassword } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

interface ResetPasswordClientProps {
	token: string;
}

/**
 * 비밀번호 재설정 클라이언트 컴포넌트
 */
export const ResetPasswordClient = observer(function ResetPasswordClient({
	token,
}: ResetPasswordClientProps) {
	return <IdpResetPassword token={token} />;
});

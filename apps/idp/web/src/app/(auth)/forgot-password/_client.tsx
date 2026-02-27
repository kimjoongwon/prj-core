"use client";

import { IdpForgotPassword } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

/**
 * 비밀번호 찾기 클라이언트 컴포넌트
 */
export const ForgotPasswordClient = observer(function ForgotPasswordClient() {
	return <IdpForgotPassword />;
});

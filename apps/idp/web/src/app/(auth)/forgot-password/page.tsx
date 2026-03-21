"use client";

import { IdpForgotPassword } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

function ForgotPasswordPage() {
	return <ForgotPasswordClient />;
}

/**
 * 비밀번호 찾기 클라이언트 컴포넌트
 */
const ForgotPasswordClient = observer(function ForgotPasswordClient() {
	return <IdpForgotPassword />;
});

export default observer(ForgotPasswordPage);

"use client";

import { useParams } from "next/navigation";
import { IdpResetPassword } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

type ResetPasswordPageParams = {
	token: string;
};

function ResetPasswordPage() {
	const { token } = useParams<ResetPasswordPageParams>();

	return <ResetPasswordClient token={token} />;
}

interface ResetPasswordClientProps {
	token: string;
}

/**
 * 비밀번호 재설정 클라이언트 컴포넌트
 */
const ResetPasswordClient = observer(function ResetPasswordClient({
	token,
}: ResetPasswordClientProps) {
	return <IdpResetPassword token={token} />;
});

export default observer(ResetPasswordPage);

import { ResetPasswordClient } from "./_client";

interface ResetPasswordPageProps {
	params: Promise<{ token: string }>;
}

/**
 * 비밀번호 재설정 페이지 (서버 컴포넌트)
 */
export default async function ResetPasswordPage({
	params,
}: ResetPasswordPageProps) {
	const { token } = await params;
	return <ResetPasswordClient token={token} />;
}

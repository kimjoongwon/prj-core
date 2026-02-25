import { ErrorClient } from "./_client";

interface ErrorPageProps {
	searchParams: Promise<{ error?: string; error_description?: string }>;
}

/**
 * OIDC 에러 페이지 (서버 컴포넌트)
 *
 * oidc-provider의 renderError에서 리다이렉트된 에러 정보를 표시합니다.
 */
export default async function ErrorPage({ searchParams }: ErrorPageProps) {
	const params = await searchParams;

	return (
		<ErrorClient
			error={params.error || "Unknown Error"}
			errorDescription={params.error_description || ""}
		/>
	);
}

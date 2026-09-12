import type { ReactNode } from "react";

import { AuthenticatedProviders } from "./authenticated-providers";

/**
 * 인증된 라우트 그룹 layout
 *
 * 이 트리 안의 라우트(select-space, (admin))에 들어온 순간부터
 * 세션·권한·tenant bootstrap이 동작합니다. /auth/*는 이 그룹 밖에 있어
 * 로그인 화면에서 인증 API가 호출되지 않습니다.
 */
export default function AuthenticatedLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <AuthenticatedProviders>{children}</AuthenticatedProviders>;
}

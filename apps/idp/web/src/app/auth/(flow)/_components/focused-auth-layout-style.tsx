import type { OidcClientLoginUi } from "@cocrepo/type";

/**
 * 클라이언트 loginUi 정책이 인트로 패널 숨김을 요구하면 로그인/동의 화면을
 * 폼 한 컬럼으로 좁히는 스타일(모바일 전체화면 변형 등). 서버에서 정적으로
 * 계산해 렌더한다.
 */
export function FocusedAuthLayoutStyle({
	loginUi,
}: {
	loginUi?: OidcClientLoginUi | null;
}) {
	const shouldFocusAuthPanel = Boolean(
		loginUi?.mobileFullScreen || loginUi?.showIntroPanel === false,
	);

	if (!shouldFocusAuthPanel) {
		return null;
	}

	return (
		<style>{`
			.idp-auth-intro-panel { display: none; }
			.idp-auth-layout-grid {
				grid-template-columns: minmax(0, 440px);
				justify-content: center;
			}
		`}</style>
	);
}

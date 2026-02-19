import GroundNewPageClient from "./_client";

/**
 * 시설 등록 페이지 - 서버 컴포넌트
 * 등록 폼은 프리페치 데이터가 필요하지 않아 바로 클라이언트로 렌더링합니다.
 */
export default function GroundNewPage() {
	return <GroundNewPageClient />;
}

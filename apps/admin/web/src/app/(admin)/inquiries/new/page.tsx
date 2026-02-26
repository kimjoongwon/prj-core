import InquiriesNewPageClient from "./_client";

/**
 * 문의 접수 페이지 - 서버 컴포넌트
 * 신규 문의 등록은 Prefetch 없이 클라이언트 컴포넌트만 렌더링합니다.
 */
export default function InquiriesNewPage() {
	return <InquiriesNewPageClient />;
}

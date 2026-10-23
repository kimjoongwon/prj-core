import { useEffect, useState } from "react";

/**
 * 뷰포트 너비가 minWidthPx 이상인지 추적합니다.
 * SSR 첫 렌더는 항상 false(좁은 레이아웃)를 반환하고 마운트 후 실제 값을 반영합니다.
 */
export function useIsWideViewport(minWidthPx = 1024): boolean {
	const [isWideViewport, setIsWideViewport] = useState(false);

	useEffect(() => {
		const viewportMediaQuery = window.matchMedia(
			`(min-width: ${minWidthPx}px)`,
		);
		const syncViewportWidth = () => {
			setIsWideViewport(viewportMediaQuery.matches);
		};
		syncViewportWidth();
		viewportMediaQuery.addEventListener("change", syncViewportWidth);
		return () => {
			viewportMediaQuery.removeEventListener("change", syncViewportWidth);
		};
	}, [minWidthPx]);

	return isWideViewport;
}

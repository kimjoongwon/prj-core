import { getYear } from "@cocrepo/toolkit";

export interface CopyrightProps {
	/** 회사명 */
	companyName: string;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * Copyright 컴포넌트
 * 저작권 표시 텍스트를 렌더링합니다.
 *
 * @example
 * ```tsx
 * <Copyright companyName="플레이트" />
 * // 출력: © 2026 플레이트. All rights reserved.
 * ```
 */
export const Copyright = (props: CopyrightProps) => {
	const { companyName } = props;
	return (
		<p className="text-center text-gray-500 text-xs">
			© {getYear()} {companyName}. All rights reserved.
		</p>
	);
};

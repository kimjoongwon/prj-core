import * as LucideIcons from "lucide-react";
import { createElement } from "react";

/**
 * Lucide 아이콘 이름을 기반으로 아이콘 컴포넌트를 동적으로 렌더링합니다.
 * @param iconName - lucide-react 아이콘 이름 (예: 'Home', 'User', 'Settings')
 * @param className - 아이콘에 적용할 CSS 클래스
 * @param size - 아이콘 크기 (기본값: 16)
 * @returns React 아이콘 엘리먼트 또는 null
 */
export const renderLucideIcon = (
	iconName?: string,
	className?: string,
	size: number = 16,
) => {
	if (!iconName) return null;

	// LucideIcons에서 해당 아이콘을 찾습니다
	const IconComponent = (LucideIcons as any)[iconName];

	if (!IconComponent) {
		console.warn(`Icon "${iconName}" not found in lucide-react`);
		return null;
	}

	return createElement(IconComponent, {
		className,
		size,
	});
};

/**
 * 사용 가능한 모든 Lucide 아이콘 이름을 반환합니다.
 * @returns Lucide 아이콘 이름 배열
 */
export const getAvailableLucideIcons = (): string[] => {
	return Object.keys(LucideIcons).filter(
		(key) => key !== "createLucideIcon" && key !== "Icon",
	);
};

/**
 * 아이콘 이름이 유효한지 확인합니다.
 * @param iconName - 확인할 아이콘 이름
 * @returns 유효한 아이콘 이름인지 여부
 */
export const isValidLucideIcon = (iconName: string): boolean => {
	return iconName in LucideIcons;
};

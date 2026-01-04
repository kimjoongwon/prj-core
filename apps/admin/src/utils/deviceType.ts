import type { DeviceType } from "../hooks/useColumnVisibility";

/**
 * 디바이스 타입 브레이크포인트 정의
 * - desktop: 1280px 이상
 * - tablet: 768px - 1279px
 * - mobile: 768px 미만
 */
export const DEVICE_BREAKPOINTS = {
	MOBILE_MAX: 767,
	TABLET_MIN: 768,
	TABLET_MAX: 1279,
	DESKTOP_MIN: 1280,
} as const;

/**
 * 현재 화면 너비를 기준으로 디바이스 타입을 감지합니다.
 *
 * @param width - 화면 너비 (기본값: window.innerWidth)
 * @returns DeviceType - "desktop" | "tablet" | "mobile"
 *
 * @example
 * ```tsx
 * const deviceType = getDeviceType();
 * // "desktop"
 *
 * const customDevice = getDeviceType(800);
 * // "tablet"
 * ```
 */
export function getDeviceType(width?: number): DeviceType {
	const screenWidth =
		width ??
		(typeof window !== "undefined"
			? window.innerWidth
			: DEVICE_BREAKPOINTS.DESKTOP_MIN);

	if (screenWidth >= DEVICE_BREAKPOINTS.DESKTOP_MIN) {
		return "desktop";
	}

	if (screenWidth >= DEVICE_BREAKPOINTS.TABLET_MIN) {
		return "tablet";
	}

	return "mobile";
}

/**
 * 주어진 너비가 모바일 범위인지 확인합니다.
 *
 * @param width - 화면 너비
 * @returns boolean
 */
export function isMobile(width?: number): boolean {
	return getDeviceType(width) === "mobile";
}

/**
 * 주어진 너비가 태블릿 범위인지 확인합니다.
 *
 * @param width - 화면 너비
 * @returns boolean
 */
export function isTablet(width?: number): boolean {
	return getDeviceType(width) === "tablet";
}

/**
 * 주어진 너비가 데스크톱 범위인지 확인합니다.
 *
 * @param width - 화면 너비
 * @returns boolean
 */
export function isDesktop(width?: number): boolean {
	return getDeviceType(width) === "desktop";
}

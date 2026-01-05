"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * 디바이스 타입 enum
 * - DESKTOP: >= 1280px
 * - TABLET: 768-1279px
 * - MOBILE: < 768px
 */
export enum DeviceType {
	DESKTOP = "desktop",
	TABLET = "tablet",
	MOBILE = "mobile",
}

/**
 * 브레이크포인트 상수
 */
const BREAKPOINTS = {
	DESKTOP: 1280,
	TABLET: 768,
} as const;

/**
 * 화면 너비를 기반으로 디바이스 타입을 결정합니다.
 *
 * @param width - 화면 너비 (px)
 * @returns 디바이스 타입
 */
export function getDeviceTypeFromWidth(width: number): DeviceType {
	if (width >= BREAKPOINTS.DESKTOP) return DeviceType.DESKTOP;
	if (width >= BREAKPOINTS.TABLET) return DeviceType.TABLET;
	return DeviceType.MOBILE;
}

/**
 * 현재 디바이스 타입을 반환합니다.
 * SSR 환경에서는 기본값으로 DESKTOP을 반환합니다.
 *
 * @returns 현재 디바이스 타입
 */
export function getDeviceType(): DeviceType {
	if (typeof window === "undefined") {
		return DeviceType.DESKTOP;
	}
	return getDeviceTypeFromWidth(window.innerWidth);
}

/**
 * useDeviceType 훅 옵션
 */
export interface UseDeviceTypeOptions {
	/** 기본 디바이스 타입 (SSR 환경용) */
	defaultType?: DeviceType;
	/** resize 이벤트 디바운스 딜레이 (ms) */
	debounceDelay?: number;
}

/**
 * 디바이스 타입 감지 훅
 *
 * 반응형 레이아웃을 위해 현재 디바이스 타입을 감지합니다.
 * 화면 크기 변경 시 자동으로 업데이트됩니다.
 *
 * @param options - 훅 옵션
 * @returns 현재 디바이스 타입
 *
 * @example
 * ```tsx
 * const deviceType = useDeviceType();
 *
 * if (deviceType === DeviceType.MOBILE) {
 *   return <MobileView />;
 * }
 *
 * return <DesktopView />;
 * ```
 *
 * @example
 * ```tsx
 * // 옵션 사용
 * const deviceType = useDeviceType({
 *   defaultType: DeviceType.MOBILE,
 *   debounceDelay: 150,
 * });
 * ```
 */
export function useDeviceType(options: UseDeviceTypeOptions = {}): DeviceType {
	const { defaultType = DeviceType.DESKTOP, debounceDelay = 100 } = options;

	const [deviceType, setDeviceType] = useState<DeviceType>(() => {
		// 클라이언트 환경이면 실제 크기 기반으로 초기값 설정
		if (typeof window !== "undefined") {
			return getDeviceType();
		}
		return defaultType;
	});

	const handleResize = useCallback(() => {
		const newType = getDeviceType();
		setDeviceType((prevType) => {
			// 타입이 실제로 변경된 경우에만 업데이트
			if (prevType !== newType) {
				return newType;
			}
			return prevType;
		});
	}, []);

	useEffect(() => {
		// SSR 환경 체크
		if (typeof window === "undefined") {
			return;
		}

		// 마운트 시 현재 디바이스 타입 설정
		handleResize();

		// 디바운스 타이머 ID
		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		const debouncedResize = () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(handleResize, debounceDelay);
		};

		// resize 이벤트 리스너 등록
		window.addEventListener("resize", debouncedResize);

		// 클린업
		return () => {
			window.removeEventListener("resize", debouncedResize);
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [handleResize, debounceDelay]);

	return deviceType;
}

/**
 * 디바이스 타입별 불리언 값 반환 훅
 *
 * @returns 각 디바이스 타입 여부
 *
 * @example
 * ```tsx
 * const { isMobile, isTablet, isDesktop } = useDeviceFlags();
 *
 * return (
 *   <div>
 *     {isMobile && <MobileNav />}
 *     {!isMobile && <DesktopNav />}
 *   </div>
 * );
 * ```
 */
export function useDeviceFlags(options: UseDeviceTypeOptions = {}) {
	const deviceType = useDeviceType(options);

	return {
		isMobile: deviceType === DeviceType.MOBILE,
		isTablet: deviceType === DeviceType.TABLET,
		isDesktop: deviceType === DeviceType.DESKTOP,
		/** 태블릿 이상 (태블릿 + 데스크톱) */
		isTabletOrAbove: deviceType !== DeviceType.MOBILE,
		/** 태블릿 이하 (모바일 + 태블릿) */
		isTabletOrBelow: deviceType !== DeviceType.DESKTOP,
	};
}

"use client";

import { type DeviceType, getDeviceType } from "@cocrepo/toolkit";
import { useEffect, useState } from "react";

/**
 * useDeviceType Hook
 *
 * 화면 크기 변화를 감지하여 현재 디바이스 타입을 반환합니다.
 * resize 이벤트를 구독하여 반응형으로 동작합니다.
 *
 * @returns DeviceType - "desktop" | "tablet" | "mobile"
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const deviceType = useDeviceType();
 *
 *   return <div>Device: {deviceType}</div>;
 * }
 * ```
 */
export function useDeviceType(): DeviceType {
	const [deviceType, setDeviceType] = useState<DeviceType>(() =>
		getDeviceType(),
	);

	useEffect(() => {
		const handleResize = () => {
			setDeviceType(getDeviceType());
		};

		// resize 이벤트 구독
		window.addEventListener("resize", handleResize);

		// cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return deviceType;
}

"use client";

import { observer } from "mobx-react-lite";
import type { ComponentType } from "react";
import { ScreenSurface } from "../surface";

/**
 * Public screen export를 ScreenSurface로 감싸 screen 계층이 outer surface를 소유하게 합니다.
 *
 * @param Screen - surface-less screen implementation component
 * @param displayName - React DevTools에 표시할 screen 이름
 * @returns ScreenSurface로 감싼 public screen component
 */
export function withScreenSurface<P extends object>(
	Screen: ComponentType<P>,
	displayName: string,
) {
	const WrappedScreen = observer((props: P) => (
		<ScreenSurface>
			<Screen {...props} />
		</ScreenSurface>
	));

	WrappedScreen.displayName = displayName;

	return WrappedScreen;
}

"use client";

import type { TimeRemainingCellProps } from "./TimeRemainingCell";

export function formatRemainingTime(remainingMinutes: number): string {
	if (remainingMinutes <= 0) return "위반";
	if (remainingMinutes < 60) return `${remainingMinutes}분`;
	const remainingHours = Math.floor(remainingMinutes / 60);
	const minuteRemainder = remainingMinutes % 60;
	if (remainingHours >= 24) {
		const remainingDays = Math.floor(remainingHours / 24);
		return `${remainingDays}일 ${remainingHours % 24}시간`;
	}
	return minuteRemainder > 0
		? `${remainingHours}시간 ${minuteRemainder}분`
		: `${remainingHours}시간`;
}

export function useHandlers(state: TimeRemainingCellProps) {
	return {
		getRemainingTimeText: () =>
			state.remainingMinutes == null
				? (state.warningFallbackLabel ?? "임박")
				: formatRemainingTime(state.remainingMinutes),
	};
}

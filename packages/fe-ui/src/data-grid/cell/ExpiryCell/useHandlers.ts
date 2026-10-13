"use client";

import { formatDateTime } from "@cocrepo/toolkit";
import type { ExpiryCellProps } from "./ExpiryCell";

export function getRelativeExpiryTime(
	expiresAt: Date,
	now = new Date(),
): string {
	const remainingMilliseconds = expiresAt.getTime() - now.getTime();
	if (remainingMilliseconds <= 0) return "만료됨";
	const remainingMinutes = Math.floor(remainingMilliseconds / (1000 * 60));
	const remainingHours = Math.floor(remainingMinutes / 60);
	const remainingDays = Math.floor(remainingHours / 24);
	if (remainingDays > 0) {
		return `${remainingDays}d ${remainingHours % 24}h 남음`;
	}
	if (remainingHours > 0) {
		return `${remainingHours}h ${remainingMinutes % 60}m 남음`;
	}
	return `${remainingMinutes}m 남음`;
}

export function useHandlers(state: ExpiryCellProps) {
	return {
		getExpiryPresentation: () => {
			const expiresAt = state.expiresAt;
			if (!expiresAt || Number.isNaN(expiresAt.getTime())) {
				return {
					isEmpty: true,
					relativeTime: "",
					expiresAtText: "",
					isExpired: false,
				};
			}
			const relativeTime = getRelativeExpiryTime(expiresAt);
			return {
				isEmpty: false,
				relativeTime,
				expiresAtText: formatDateTime(expiresAt),
				isExpired: relativeTime === "만료됨",
			};
		},
	};
}

"use client";

import type { PhoneCellProps } from "./PhoneCell";

export function formatPhoneNumber(phoneNumber: string | null | undefined) {
	if (!phoneNumber) return "-";
	if (phoneNumber.includes("-")) return phoneNumber;
	const phoneDigits = phoneNumber.replace(/\D/g, "");
	if (phoneDigits.length === 11) {
		return phoneDigits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
	}
	if (phoneDigits.length === 10) {
		return phoneDigits.startsWith("02")
			? phoneDigits.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3")
			: phoneDigits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
	}
	return phoneDigits;
}

export function useHandlers(state: PhoneCellProps) {
	return { getDisplayPhoneNumber: () => formatPhoneNumber(state.value) };
}

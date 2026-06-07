"use client";

import { useEffect, useRef } from "react";

/**
 * Debounced callback 훅
 * @param callback 실행할 콜백 함수
 * @param delay 딜레이 (ms)
 * @returns debounced 콜백 함수
 */
export function useDebouncedCallback<T extends (...args: never[]) => unknown>(
	callback: T,
	delay: number,
): (...args: Parameters<T>) => void {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const callbackRef = useRef(callback);

	// 콜백 참조 업데이트
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	// cleanup on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const debouncedCallback = (...args: Parameters<T>) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			callbackRef.current(...(args as Parameters<T>));
		}, delay);
	};

	return debouncedCallback;
}

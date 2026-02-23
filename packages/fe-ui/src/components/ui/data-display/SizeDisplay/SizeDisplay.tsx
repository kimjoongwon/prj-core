"use client";

import { observer } from "mobx-react-lite";

export interface SizeDisplayProps {
	/** 바이트 크기 */
	bytes: number;
	/** 소수점 자릿수 (기본값: 1) */
	decimals?: number;
	/** 추가 클래스명 */
	className?: string;
}

/**
 * 바이트를 사람이 읽기 쉬운 형태로 변환
 * 예: 1536 → "1.5 KB"
 */
const formatBytes = (bytes: number, decimals: number): string => {
	if (bytes === 0) return "0 B";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));
	const value = parseFloat((bytes / k ** i).toFixed(dm));

	return `${value} ${sizes[i]}`;
};

/**
 * 파일 크기를 사람이 읽기 쉬운 형태로 표시하는 컴포넌트
 */
export const SizeDisplay = observer(
	({ bytes, decimals = 1, className }: SizeDisplayProps) => {
		const formattedSize = formatBytes(bytes, decimals);

		return <span className={className}>{formattedSize}</span>;
	},
);

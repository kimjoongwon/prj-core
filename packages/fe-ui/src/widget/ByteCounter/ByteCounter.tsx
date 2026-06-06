"use client";

import { observer } from "mobx-react-lite";

export interface ByteCounterProps {
	/** 텍스트 */
	text: string;
	/** 1장당 바이트 수 (기본: 90) */
	bytesPerMessage?: number;
}

/** 텍스트의 바이트 길이를 계산합니다 (한글: 2바이트, 영문/숫자/특수문자: 1바이트) */
const calculateByteLength = (text: string): number => {
	let byteLength = 0;

	for (let i = 0; i < text.length; i++) {
		const charCode = text.charCodeAt(i);
		byteLength += charCode > 127 ? 2 : 1;
	}

	return byteLength;
};

/**
 * ByteCounter 컴포넌트
 * SMS 본문의 바이트 수와 장수를 실시간으로 표시합니다.
 *
 * @example
 * ```tsx
 * <ByteCounter text="안녕하세요" />
 * <ByteCounter text={messageContent} bytesPerMessage={140} />
 * ```
 */
export const ByteCounter = observer(
	({ text, bytesPerMessage = 90 }: ByteCounterProps) => {
		const byteLength = calculateByteLength(text);
		const messageCount = Math.max(1, Math.ceil(byteLength / bytesPerMessage));
		const isExceeded = messageCount > 1;

		const colorClass = isExceeded ? "text-warning" : "text-muted";

		return (
			<span className={`text-sm ${colorClass}`}>
				바이트: {byteLength} / {bytesPerMessage} ({messageCount}장)
			</span>
		);
	},
);

ByteCounter.displayName = "ByteCounter";

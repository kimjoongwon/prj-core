import { isValidElement, type ReactNode } from "react";

/**
 * 문자열·숫자로만 구성된 children을 단일 문자열로 정규화합니다.
 *
 * 접근성 label이나 slot class 적용처에서 ReactNode children이 순수 텍스트인지
 * 확인하고, 복잡한 요소가 섞여 있으면 `null`을 반환해 원본 렌더링에 위임합니다.
 * HeroUI `Typography` 전환 이후 compound/action wrapper의 문자열 children
 * 정규화 기준으로 사용합니다.
 */

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const collectTextParts = (node: ReactNode): string[] | null => {
	if (node === null || node === undefined || typeof node === "boolean") {
		return [];
	}

	if (typeof node === "string") {
		const value = normalizeText(node);
		return value ? [value] : [];
	}

	if (typeof node === "number") {
		return [String(node)];
	}

	if (isValidElement(node)) {
		return null;
	}

	if (Array.isArray(node)) {
		const parts: string[] = [];

		for (const child of node) {
			const childParts = collectTextParts(child);

			if (childParts === null) {
				return null;
			}

			parts.push(...childParts);
		}

		return parts;
	}

	return null;
};

export const getTextContent = (node: ReactNode): string | null => {
	const parts = collectTextParts(node);
	const content = parts?.join(" ").trim();
	return content ? content : null;
};

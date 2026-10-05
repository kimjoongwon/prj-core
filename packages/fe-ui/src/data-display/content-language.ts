export type ContentLanguageCode = "ko_KR" | "en_US" | "zh_CN" | "ja_JP";

export const CONTENT_LANGUAGE_LABELS: Record<ContentLanguageCode, string> = {
	ko_KR: "한국어",
	en_US: "English",
	zh_CN: "中文",
	ja_JP: "日本語",
};

export const CONTENT_LANGUAGE_OPTIONS = [
	{ code: "ko_KR", label: CONTENT_LANGUAGE_LABELS.ko_KR },
	{ code: "en_US", label: CONTENT_LANGUAGE_LABELS.en_US },
	{ code: "zh_CN", label: CONTENT_LANGUAGE_LABELS.zh_CN },
	{ code: "ja_JP", label: CONTENT_LANGUAGE_LABELS.ja_JP },
] satisfies { code: ContentLanguageCode; label: string }[];

export function toContentLanguageCode(
	value?: string | null,
): ContentLanguageCode | null {
	if (
		value === "ko_KR" ||
		value === "en_US" ||
		value === "zh_CN" ||
		value === "ja_JP"
	) {
		return value;
	}

	return null;
}

export function getContentLanguageLabel(value?: string | null) {
	const languageCode = toContentLanguageCode(value);

	return languageCode ? CONTENT_LANGUAGE_LABELS[languageCode] : "미설정";
}

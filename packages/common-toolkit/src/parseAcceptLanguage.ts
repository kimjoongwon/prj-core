import {
	DEFAULT_LANGUAGE,
	type LanguageCode,
	supportedLanguages,
} from "@cocrepo/constant";

/**
 * Accept-Language 헤더 값을 파싱하여 지원되는 언어 코드를 반환합니다
 *
 * @param header - Accept-Language 헤더 값 (예: "en-US,en;q=0.9,ko;q=0.8")
 * @returns 지원되는 언어 코드 (ko_KR, en_US, zh_CN, ja_JP)
 *
 * @example
 * parseAcceptLanguage("en-US,en;q=0.9,ko;q=0.8") // => "en_US"
 * parseAcceptLanguage("zh-CN") // => "zh_CN"
 * parseAcceptLanguage("fr-FR") // => "ko_KR" (기본값)
 * parseAcceptLanguage(undefined) // => "ko_KR" (기본값)
 */
export function parseAcceptLanguage(header?: string): LanguageCode {
	if (!header) return DEFAULT_LANGUAGE;

	// Accept-Language 파싱: "en-US,en;q=0.9,ko;q=0.8"
	const languages = header
		.split(",")
		.map((lang) => {
			const [rawCode = "", rawQuality] = lang.trim().split(";q=");
			const quality = rawQuality ? Number.parseFloat(rawQuality) : 1.0;
			// 하이픈(-)을 언더스코어(_)로 변환: en-US → en_US
			return { code: rawCode.replace("-", "_"), quality };
		})
		.sort((a, b) => b.quality - a.quality);

	// 지원되는 첫 번째 언어 찾기
	for (const { code } of languages) {
		const [requestedLanguage] = code.split("_");
		const matched = supportedLanguages.find((lang: LanguageCode) => {
			const [supportedLanguage] = lang.split("_");
			return (
				lang.toLowerCase() === code.toLowerCase() ||
				(requestedLanguage !== undefined &&
					supportedLanguage === requestedLanguage)
			);
		});
		if (matched) return matched as LanguageCode;
	}

	return DEFAULT_LANGUAGE;
}

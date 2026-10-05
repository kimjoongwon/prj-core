export enum LanguageCode {
	ko_KR = "ko_KR",
	en_US = "en_US",
	zh_CN = "zh_CN",
	ja_JP = "ja_JP",
}

export const DEFAULT_LANGUAGE = LanguageCode.ko_KR;
export const supportedLanguageCount = Object.values(LanguageCode).length;
export const supportedLanguages = Object.values(LanguageCode);

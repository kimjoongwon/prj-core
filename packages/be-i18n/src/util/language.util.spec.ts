import { DEFAULT_LANGUAGE, LanguageCode } from "@cocrepo/constant";
import { parseAcceptLanguage } from "./language.util";

describe("parseAcceptLanguage", () => {
	describe("기본 언어 테스트", () => {
		it("undefined 입력 시 기본 언어(ko_KR)를 반환해야 한다", () => {
			// Given
			const header = undefined;

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(DEFAULT_LANGUAGE);
			expect(result).toBe(LanguageCode.ko_KR);
		});

		it("빈 문자열 입력 시 기본 언어(ko_KR)를 반환해야 한다", () => {
			// Given
			const header = "";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(DEFAULT_LANGUAGE);
			expect(result).toBe(LanguageCode.ko_KR);
		});
	});

	describe("단일 언어 테스트", () => {
		it("ko-KR 입력 시 ko_KR을 반환해야 한다", () => {
			// Given
			const header = "ko-KR";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.ko_KR);
		});

		it("en-US 입력 시 en_US를 반환해야 한다", () => {
			// Given
			const header = "en-US";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.en_US);
		});

		it("zh-CN 입력 시 zh_CN을 반환해야 한다", () => {
			// Given
			const header = "zh-CN";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.zh_CN);
		});

		it("ja-JP 입력 시 ja_JP를 반환해야 한다", () => {
			// Given
			const header = "ja-JP";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.ja_JP);
		});
	});

	describe("우선순위 테스트 (q 값 포함)", () => {
		it("en-US,en;q=0.9,ko;q=0.8 입력 시 가장 높은 우선순위인 en_US를 반환해야 한다", () => {
			// Given
			const header = "en-US,en;q=0.9,ko;q=0.8";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.en_US);
		});

		it("ko;q=0.8,en-US;q=0.9,zh-CN 입력 시 기본값(q=1.0)인 zh_CN을 반환해야 한다", () => {
			// Given
			const header = "ko;q=0.8,en-US;q=0.9,zh-CN";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.zh_CN);
		});

		it("ko;q=0.5,en;q=0.9 입력 시 높은 우선순위인 en_US를 반환해야 한다", () => {
			// Given
			const header = "ko;q=0.5,en;q=0.9";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.en_US);
		});
	});

	describe("부분 매칭 테스트", () => {
		it("en 입력 시 en_US를 반환해야 한다", () => {
			// Given
			const header = "en";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.en_US);
		});

		it("ko 입력 시 ko_KR을 반환해야 한다", () => {
			// Given
			const header = "ko";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.ko_KR);
		});

		it("zh 입력 시 zh_CN을 반환해야 한다", () => {
			// Given
			const header = "zh";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.zh_CN);
		});

		it("ja 입력 시 ja_JP를 반환해야 한다", () => {
			// Given
			const header = "ja";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.ja_JP);
		});

		it("en,ko;q=0.9 입력 시 부분 매칭으로 en_US를 반환해야 한다", () => {
			// Given
			const header = "en,ko;q=0.9";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.en_US);
		});
	});

	describe("미지원 언어 테스트", () => {
		it("fr-FR 입력 시 기본 언어(ko_KR)를 반환해야 한다", () => {
			// Given
			const header = "fr-FR";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(DEFAULT_LANGUAGE);
			expect(result).toBe(LanguageCode.ko_KR);
		});

		it("de-DE,fr-FR 입력 시 모두 미지원이므로 기본 언어(ko_KR)를 반환해야 한다", () => {
			// Given
			const header = "de-DE,fr-FR";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(DEFAULT_LANGUAGE);
			expect(result).toBe(LanguageCode.ko_KR);
		});

		it("fr-FR,en-US 입력 시 지원되는 언어인 en_US를 반환해야 한다", () => {
			// Given
			const header = "fr-FR,en-US";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.en_US);
		});

		it("fr;q=0.9,de;q=0.8,en;q=0.7 입력 시 지원되는 언어인 en_US를 반환해야 한다", () => {
			// Given
			const header = "fr;q=0.9,de;q=0.8,en;q=0.7";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.en_US);
		});
	});

	describe("대소문자 테스트", () => {
		it("EN-US 입력 시 대문자도 처리하여 en_US를 반환해야 한다", () => {
			// Given
			const header = "EN-US";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.en_US);
		});

		it("Ko-KR 입력 시 혼합 케이스도 처리하여 ko_KR을 반환해야 한다", () => {
			// Given
			const header = "Ko-KR";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.ko_KR);
		});

		it("ZH-cn 입력 시 혼합 케이스도 처리하여 zh_CN을 반환해야 한다", () => {
			// Given
			const header = "ZH-cn";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.zh_CN);
		});

		it("en-US,EN;q=0.9 입력 시 대문자도 처리하여 en_US를 반환해야 한다", () => {
			// Given
			const header = "en-US,EN;q=0.9";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.en_US);
		});
	});

	describe("복잡한 시나리오 테스트", () => {
		it("여러 언어와 q 값이 혼합된 경우 올바르게 파싱해야 한다", () => {
			// Given
			const header = "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,ko;q=0.6";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.en_US);
		});

		it("공백이 포함된 입력도 올바르게 처리해야 한다", () => {
			// Given
			const header = " en-US , ko-KR ; q=0.9 ";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.en_US);
		});

		it("동일한 우선순위에서 먼저 등장하는 언어를 선택해야 한다", () => {
			// Given
			const header = "zh-CN,en-US";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.zh_CN);
		});

		it("q=0인 언어는 무시하고 다음 언어를 선택해야 한다", () => {
			// Given
			const header = "fr;q=0,en-US;q=0.8";

			// When
			const result = parseAcceptLanguage(header);

			// Then
			expect(result).toBe(LanguageCode.en_US);
		});
	});
});

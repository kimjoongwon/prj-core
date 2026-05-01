import { describe, expect, it } from "vitest";
import {
	obsoleteTranslationSeedKeys,
	translationSeedData,
} from "./translation-seed-data";

describe("translationSeedData", () => {
	it("languageCode와 한글 의미 key 조합이 유일해야 한다", () => {
		const keys = translationSeedData.map(
			(translation) => `${translation.languageCode}:${translation.key}`,
		);

		expect(new Set(keys).size).toBe(keys.length);
	});

	it("active seed에 기존 dot-key seed를 다시 포함하지 않아야 한다", () => {
		const activeKeys = new Set(
			translationSeedData.map((translation) => translation.key),
		);

		for (const obsoleteKey of obsoleteTranslationSeedKeys) {
			expect(activeKeys.has(obsoleteKey)).toBe(false);
		}
	});

	it("번역 key는 기본적으로 한국어 의미 key여야 한다", () => {
		expect(
			translationSeedData.some((translation) => translation.key === "성공"),
		).toBe(true);
		expect(
			translationSeedData.some(
				(translation) => translation.key === "번역 목록 조회 성공",
			),
		).toBe(true);
	});
});

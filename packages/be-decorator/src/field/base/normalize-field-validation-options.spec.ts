import { describe, expect, it } from "vitest";
import { normalizeFieldOptionsForValidation } from "./normalize-field-validation-options";

describe("normalizeFieldOptionsForValidation", () => {
	it("Swagger RegExp 패턴을 검증용 문자열 source로 변환하고 원본 옵션을 보존한다", () => {
		const pattern = /^enabled$/i;
		const fieldOptions = { description: "활성 상태", pattern };

		expect(normalizeFieldOptionsForValidation(fieldOptions)).toEqual({
			description: "활성 상태",
			pattern: "^enabled$",
		});
		expect(fieldOptions.pattern).toBe(pattern);
	});

	it("문자열 패턴은 그대로 전달한다", () => {
		expect(normalizeFieldOptionsForValidation({ pattern: "^[0-9]+$" })).toEqual(
			{ pattern: "^[0-9]+$" },
		);
	});
});

import { validateSingleField, validateFields } from "@shared/utils";
import { describe, expect, it } from "vitest";

import type { Validation } from "../../types/index";

describe("validateSingleField", () => {
	it("should validate required fields correctly", () => {
		const validation: Validation = {
			required: { value: true, message: "필수 입력입니다" },
		};

		// 필수 필드가 비어있는 경우
		expect(validateSingleField("", validation)).toEqual({
			isValid: false,
			errorMessage: "필수 입력입니다",
		});

		expect(validateSingleField(null, validation)).toEqual({
			isValid: false,
			errorMessage: "필수 입력입니다",
		});

		expect(validateSingleField(undefined, validation)).toEqual({
			isValid: false,
			errorMessage: "필수 입력입니다",
		});

		// 필수 필드가 값이 있는 경우
		expect(validateSingleField("test", validation)).toEqual({
			isValid: true,
		});
	});

	it("should validate minLength correctly", () => {
		const validation: Validation = {
			minLength: { value: 3, message: "최소 3자 이상 입력해주세요" },
		};

		// 최소 길이보다 짧은 경우
		expect(validateSingleField("ab", validation)).toEqual({
			isValid: false,
			errorMessage: "최소 3자 이상 입력해주세요",
		});

		// 최소 길이를 만족하는 경우
		expect(validateSingleField("abc", validation)).toEqual({
			isValid: true,
		});

		expect(validateSingleField("abcd", validation)).toEqual({
			isValid: true,
		});

		// 빈 값인 경우 (required가 아니므로 통과)
		expect(validateSingleField("", validation)).toEqual({
			isValid: true,
		});
	});

	it("should validate maxLength correctly", () => {
		const validation: Validation = {
			maxLength: { value: 5, message: "최대 5자까지 입력 가능합니다" },
		};

		// 최대 길이를 초과하는 경우
		expect(validateSingleField("abcdef", validation)).toEqual({
			isValid: false,
			errorMessage: "최대 5자까지 입력 가능합니다",
		});

		// 최대 길이를 만족하는 경우
		expect(validateSingleField("abcde", validation)).toEqual({
			isValid: true,
		});

		expect(validateSingleField("abc", validation)).toEqual({
			isValid: true,
		});
	});

	it("should validate min value correctly", () => {
		const validation: Validation = {
			min: { value: 10, message: "최소 10 이상이어야 합니다" },
		};

		// 최소값보다 작은 경우
		expect(validateSingleField("5", validation)).toEqual({
			isValid: false,
			errorMessage: "최소 10 이상이어야 합니다",
		});

		expect(validateSingleField(5, validation)).toEqual({
			isValid: false,
			errorMessage: "최소 10 이상이어야 합니다",
		});

		// 최소값을 만족하는 경우
		expect(validateSingleField("10", validation)).toEqual({
			isValid: true,
		});

		expect(validateSingleField(15, validation)).toEqual({
			isValid: true,
		});
	});

	it("should validate max value correctly", () => {
		const validation: Validation = {
			max: { value: 100, message: "최대 100까지 입력 가능합니다" },
		};

		// 최대값을 초과하는 경우
		expect(validateSingleField("101", validation)).toEqual({
			isValid: false,
			errorMessage: "최대 100까지 입력 가능합니다",
		});

		expect(validateSingleField(150, validation)).toEqual({
			isValid: false,
			errorMessage: "최대 100까지 입력 가능합니다",
		});

		// 최대값을 만족하는 경우
		expect(validateSingleField("100", validation)).toEqual({
			isValid: true,
		});

		expect(validateSingleField(50, validation)).toEqual({
			isValid: true,
		});
	});

	it("should validate patterns correctly", () => {
		const validation: Validation = {
			patterns: [
				{ value: /^[a-zA-Z]+$/, message: "영문자만 입력 가능합니다" },
				{ value: "^[A-Z]", message: "첫 글자는 대문자여야 합니다" },
			],
		};

		// 패턴에 맞지 않는 경우
		expect(validateSingleField("test123", validation)).toEqual({
			isValid: false,
			errorMessage: "영문자만 입력 가능합니다",
		});

		expect(validateSingleField("test", validation)).toEqual({
			isValid: false,
			errorMessage: "첫 글자는 대문자여야 합니다",
		});

		// 패턴에 맞는 경우
		expect(validateSingleField("Test", validation)).toEqual({
			isValid: true,
		});
	});

	it("should handle multiple validation rules", () => {
		const validation: Validation = {
			required: { value: true, message: "필수 입력입니다" },
			minLength: { value: 3, message: "최소 3자 이상" },
			maxLength: { value: 10, message: "최대 10자까지" },
			patterns: [{ value: /^[a-zA-Z]+$/, message: "영문자만 입력 가능합니다" }],
		};

		// 빈 값 (required 검증 실패)
		expect(validateSingleField("", validation)).toEqual({
			isValid: false,
			errorMessage: "필수 입력입니다",
		});

		// 길이 부족 (minLength 검증 실패)
		expect(validateSingleField("ab", validation)).toEqual({
			isValid: false,
			errorMessage: "최소 3자 이상",
		});

		// 길이 초과 (maxLength 검증 실패)
		expect(validateSingleField("abcdefghijk", validation)).toEqual({
			isValid: false,
			errorMessage: "최대 10자까지",
		});

		// 패턴 불일치 (patterns 검증 실패)
		expect(validateSingleField("abc123", validation)).toEqual({
			isValid: false,
			errorMessage: "영문자만 입력 가능합니다",
		});

		// 모든 검증 통과
		expect(validateSingleField("abcdef", validation)).toEqual({
			isValid: true,
		});
	});
});

describe("validateFields", () => {
	it("should validate multiple fields correctly", () => {
		const state = {
			form: {
				inputs: {
					name: "John",
					age: 25,
					email: "john@example.com",
				},
			},
		};

		const validationFields = {
			"form.inputs.name": {
				required: { value: true, message: "이름은 필수입니다" },
				minLength: { value: 2, message: "최소 2자 이상" },
			},
			"form.inputs.age": {
				required: { value: true, message: "나이는 필수입니다" },
				min: { value: 18, message: "18세 이상이어야 합니다" },
			},
			"form.inputs.email": {
				required: { value: true, message: "이메일은 필수입니다" },
				patterns: [
					{
						value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
						message: "올바른 이메일 형식이 아닙니다",
					},
				],
			},
		};

		// 모든 필드가 유효한 경우
		expect(validateFields(state, validationFields)).toEqual({
			isValid: true,
		});

		// 이름이 너무 짧은 경우
		const invalidNameState = {
			...state,
			form: {
				inputs: {
					...state.form.inputs,
					name: "J",
				},
			},
		};

		expect(validateFields(invalidNameState, validationFields)).toEqual({
			isValid: false,
			errorMessage: "최소 2자 이상",
		});

		// 나이가 부족한 경우
		const invalidAgeState = {
			...state,
			form: {
				inputs: {
					...state.form.inputs,
					age: 15,
				},
			},
		};

		expect(validateFields(invalidAgeState, validationFields)).toEqual({
			isValid: false,
			errorMessage: "18세 이상이어야 합니다",
		});

		// 이메일이 잘못된 경우
		const invalidEmailState = {
			...state,
			form: {
				inputs: {
					...state.form.inputs,
					email: "invalid-email",
				},
			},
		};

		expect(validateFields(invalidEmailState, validationFields)).toEqual({
			isValid: false,
			errorMessage: "올바른 이메일 형식이 아닙니다",
		});
	});

	it("should handle nested object paths", () => {
		const state = {
			user: {
				profile: {
					personal: {
						firstName: "John",
						lastName: "Doe",
					},
				},
			},
		};

		const validationFields = {
			"user.profile.personal.firstName": {
				required: { value: true, message: "성은 필수입니다" },
			},
			"user.profile.personal.lastName": {
				required: { value: true, message: "이름은 필수입니다" },
			},
		};

		expect(validateFields(state, validationFields)).toEqual({
			isValid: true,
		});

		// 중첩된 필드가 비어있는 경우
		const invalidState = {
			user: {
				profile: {
					personal: {
						firstName: "",
						lastName: "Doe",
					},
				},
			},
		};

		expect(validateFields(invalidState, validationFields)).toEqual({
			isValid: false,
			errorMessage: "성은 필수입니다",
		});
	});
});

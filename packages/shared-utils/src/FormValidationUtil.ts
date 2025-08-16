export type Validation = {
	timings?: ("onBlur" | "onChange" | "onFocus")[];
	required?: { value: boolean; message: string };
	minLength?: { value: number; message: string };
	maxLength?: { value: number; message: string };
	min?: { value: number; message: string };
	max?: { value: number; message: string };
	patterns?: { value: RegExp | string; message: string }[];
};
/**
 * Form Validation Utility
 * Form field validation을 위한 유틸리티 함수들
 */
export class FormValidationUtil {
	/**
	 * 개별 필드에 대한 validation 검증
	 */
	static validateSingleField = (
		value: any,
		validation: Validation,
	): { isValid: boolean; errorMessage?: string } => {
		const { required, minLength, maxLength, min, max, patterns } = validation;

		// 필수 값 검증
		if (required?.value) {
			if (value === undefined || value === null || value === "") {
				return { isValid: false, errorMessage: required.message };
			}
		}

		// 값이 없으면 다른 검증은 건너뛰기 (required가 아닌 경우)
		if (value === undefined || value === null || value === "") {
			return { isValid: true };
		}

		const strValue = String(value);
		const numValue = Number(value);

		// 최소 길이 검증
		if (minLength && strValue.length < minLength.value) {
			return { isValid: false, errorMessage: minLength.message };
		}

		// 최대 길이 검증
		if (maxLength && strValue.length > maxLength.value) {
			return { isValid: false, errorMessage: maxLength.message };
		}

		// 최소값 검증
		if (min && !Number.isNaN(numValue) && numValue < min.value) {
			return { isValid: false, errorMessage: min.message };
		}

		// 최대값 검증
		if (max && !Number.isNaN(numValue) && numValue > max.value) {
			return { isValid: false, errorMessage: max.message };
		}

		// 정규표현식 검증
		if (patterns && patterns.length > 0) {
			for (const pattern of patterns) {
				const regex =
					pattern.value instanceof RegExp
						? pattern.value
						: new RegExp(pattern.value);

				if (!regex.test(strValue)) {
					return { isValid: false, errorMessage: pattern.message };
				}
			}
		}

		return { isValid: true };
	};

	/**
	 * validationFields를 사용한 다중 필드 검증
	 */
	static validateFields = (
		state: any,
		validationFields: Record<string, Validation>,
	): { isValid: boolean; errorMessage?: string } => {
		// lodash-es의 get 대신 간단한 path 접근 구현
		const getValue = (obj: any, path: string): any => {
			return path.split(".").reduce((current, key) => current?.[key], obj);
		};

		for (const [fieldPath, fieldValidation] of Object.entries(
			validationFields,
		)) {
			const fieldValue = getValue(state, fieldPath);
			const fieldResult = FormValidationUtil.validateSingleField(
				fieldValue,
				fieldValidation,
			);

			if (!fieldResult.isValid) {
				return {
					isValid: false,
					errorMessage: fieldResult.errorMessage,
				};
			}
		}

		return { isValid: true };
	};
}

// 기존 함수형 export도 유지 (backward compatibility)
export const validateSingleField = FormValidationUtil.validateSingleField;
export const validateFields = FormValidationUtil.validateFields;

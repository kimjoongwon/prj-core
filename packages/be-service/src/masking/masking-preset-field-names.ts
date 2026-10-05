import { MASKING_PRESETS } from "@cocrepo/constant";

/**
 * persisted masking preset id별로 응답 객체에서 탐색할 일반적인 필드명을 정의합니다.
 */
export const MASKING_PRESET_FIELD_NAMES: Record<string, string[]> = {
	[MASKING_PRESETS.EMAIL]: ["email"],
	[MASKING_PRESETS.PHONE]: [
		"phone",
		"mobile",
		"telephone",
		"phoneNumber",
		"mobileNumber",
	],
	[MASKING_PRESETS.NAME]: ["name", "fullName", "displayName", "userName"],
	[MASKING_PRESETS.SSN]: ["ssn", "socialSecurityNumber", "residentNumber"],
	[MASKING_PRESETS.CARD]: ["cardNumber", "creditCard", "debitCard"],
	[MASKING_PRESETS.ACCOUNT]: ["accountNumber", "bankAccount"],
};

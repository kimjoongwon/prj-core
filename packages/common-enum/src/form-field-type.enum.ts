/**
 * 폼 필드 타입 Enum
 * Prisma의 FormFieldType과 호환됩니다.
 */
export const FormFieldType = {
	TEXT: "TEXT",
	TEXTAREA: "TEXTAREA",
	NUMBER: "NUMBER",
	SELECT: "SELECT",
	MULTI_SELECT: "MULTI_SELECT",
	CHECKBOX: "CHECKBOX",
	RADIO: "RADIO",
	DATE: "DATE",
	DATETIME: "DATETIME",
	EMAIL: "EMAIL",
	PHONE: "PHONE",
	URL: "URL",
} as const;

export type FormFieldType =
	(typeof FormFieldType)[keyof typeof FormFieldType];

/**
 * 폼 필드 타입 라벨
 */
export const FormFieldTypeLabel: Record<FormFieldType, string> = {
	TEXT: "텍스트",
	TEXTAREA: "긴 텍스트",
	NUMBER: "숫자",
	SELECT: "단일 선택",
	MULTI_SELECT: "다중 선택",
	CHECKBOX: "체크박스",
	RADIO: "라디오",
	DATE: "날짜",
	DATETIME: "날짜/시간",
	EMAIL: "이메일",
	PHONE: "전화번호",
	URL: "URL",
};

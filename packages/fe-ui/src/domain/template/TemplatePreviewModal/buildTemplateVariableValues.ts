import type { TemplateVariable } from "../../../form/VariableInputForm";

/** 템플릿 변수의 기본값을 API 요청용 값 맵으로 변환합니다. */
export function buildTemplateVariableValues(
	variables: readonly TemplateVariable[],
): Record<string, string> {
	return Object.fromEntries(
		variables.map((variable) => [variable.name, variable.defaultValue ?? ""]),
	);
}

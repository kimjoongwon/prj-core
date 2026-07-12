import type { TemplateVariable } from "../../../form/VariableInputForm";
import type { TemplateType } from "../types";

/** 템플릿 미리보기 결과입니다. */
export interface TemplatePreviewResult {
	type: TemplateType;
	subject: string | null;
	content: string;
	unresolvedVariables: string[];
}

/** 템플릿 미리보기 진행 상태입니다. */
export type TemplatePreviewStatus = "idle" | "loading" | "success" | "error";

/** TemplatePreviewModalState 생성 계약입니다. */
export interface TemplatePreviewModalStateOptions {
	templateId: string;
	variables: readonly TemplateVariable[];
}

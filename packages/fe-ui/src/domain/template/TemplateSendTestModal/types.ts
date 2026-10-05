import type { TemplateVariable } from "../../../form/VariableInputForm";
import type { TemplateType } from "../types";

/** 템플릿 테스트 발송 결과입니다. */
export interface TemplateSendTestResult {
	success: boolean;
	sentAt: string;
	errorMessage: string | null;
}

/** 템플릿 테스트 발송 진행 상태입니다. */
export type TemplateSendTestStatus = "idle" | "loading" | "success" | "error";

/** TemplateSendTestModalState 생성 계약입니다. */
export interface TemplateSendTestModalStateOptions {
	templateId: string;
	type: TemplateType;
	variables: readonly TemplateVariable[];
}

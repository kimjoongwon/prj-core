import { makeAutoObservable } from "mobx";
import type { TemplateVariable } from "../../../form/VariableInputForm";
import { buildTemplateVariableValues } from "./buildTemplateVariableValues";
import type {
	TemplatePreviewModalStateOptions,
	TemplatePreviewResult,
	TemplatePreviewStatus,
} from "./types";

/** 템플릿 미리보기 Modal의 입력값과 실행 결과를 소유합니다. */
export class TemplatePreviewModalState {
	readonly templateId: string;
	readonly variables: TemplateVariable[];
	variableValues: Record<string, string>;
	result: TemplatePreviewResult | null = null;
	status: TemplatePreviewStatus = "idle";
	errorMessage = "";

	constructor(options: TemplatePreviewModalStateOptions) {
		this.templateId = options.templateId;
		this.variables = [...options.variables];
		this.variableValues = buildTemplateVariableValues(options.variables);

		makeAutoObservable(this, {
			templateId: false,
			variables: false,
		});
	}

	/** 변수 입력값을 교체합니다. */
	setVariableValues(values: Record<string, string>): void {
		this.variableValues = values;
	}

	/** 미리보기 요청 시작 상태로 전환합니다. */
	startPreview(): void {
		this.status = "loading";
		this.result = null;
		this.errorMessage = "";
	}

	/** 미리보기 성공 결과를 확정합니다. */
	completePreview(result: TemplatePreviewResult): void {
		this.result = result;
		this.status = "success";
	}

	/** 미리보기 실패 메시지를 확정합니다. */
	failPreview(message: string): void {
		this.result = null;
		this.status = "error";
		this.errorMessage = message;
	}

	/** 미리보기 요청 진행 여부입니다. */
	get isLoading(): boolean {
		return this.status === "loading";
	}
}

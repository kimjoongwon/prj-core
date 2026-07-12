import { makeAutoObservable } from "mobx";
import type { TemplateVariable } from "../../../form/VariableInputForm";
import type {
	TemplateSendTestModalStateOptions,
	TemplateSendTestResult,
	TemplateSendTestStatus,
} from "./types";

/** 템플릿 테스트 발송 Modal의 입력값과 실행 결과를 소유합니다. */
export class TemplateSendTestModalState {
	readonly templateId: string;
	readonly type: TemplateSendTestModalStateOptions["type"];
	readonly variables: TemplateVariable[];
	recipient = "";
	variableValues: Record<string, string> = {};
	result: TemplateSendTestResult | null = null;
	status: TemplateSendTestStatus = "idle";

	constructor(options: TemplateSendTestModalStateOptions) {
		this.templateId = options.templateId;
		this.type = options.type;
		this.variables = [...options.variables];

		makeAutoObservable(this, {
			templateId: false,
			type: false,
			variables: false,
		});
	}

	/** 테스트 수신자를 변경합니다. */
	setRecipient(recipient: string): void {
		this.recipient = recipient;
	}

	/** 변수 입력값을 교체합니다. */
	setVariableValues(values: Record<string, string>): void {
		this.variableValues = values;
	}

	/** 테스트 발송 요청 시작 상태로 전환합니다. */
	startSend(): void {
		this.status = "loading";
		this.result = null;
	}

	/** 테스트 발송 결과를 확정합니다. */
	completeSend(result: TemplateSendTestResult): void {
		this.result = result;
		this.status = result.success ? "success" : "error";
	}

	/** 테스트 발송 예외를 실패 결과로 확정합니다. */
	failSend(message: string): void {
		this.completeSend({
			success: false,
			sentAt: new Date().toISOString(),
			errorMessage: message,
		});
	}

	/** 발송 버튼 비활성화 여부입니다. */
	get isSendDisabled(): boolean {
		return this.recipient.trim() === "" || this.status === "loading";
	}
}

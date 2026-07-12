"use client";

import { useSendTestTemplate } from "@cocrepo/api/core/templates";
import type { ModalState } from "@cocrepo/store";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { observer } from "mobx-react-lite";
import { VariableInputForm } from "../../../form/VariableInputForm";
import { Button } from "../../../input/Button/Button";
import { TextField } from "../../../input/TextField/TextField";
import { formatTemplateSentAt } from "./formatTemplateSentAt";
import type { TemplateSendTestModalState } from "./TemplateSendTestModalState";
import { templateRecipientConfig } from "./templateRecipientConfig";
import type { TemplateSendTestResult } from "./types";

/** 템플릿 테스트 발송 API와 상태별 body를 소유하는 Modal content입니다. */
export const TemplateSendTestModal = observer(function TemplateSendTestModal({
	state,
}: {
	state: ModalState<TemplateSendTestModalState>;
}) {
	const sendTest = state.contentState;
	const { mutateAsync: sendTestTemplate } = useSendTestTemplate();
	const config = templateRecipientConfig[sendTest.type];

	const handleSendTest = async () => {
		sendTest.startSend();

		try {
			const response = await sendTestTemplate({
				templateId: sendTest.templateId,
				data: {
					recipient: sendTest.recipient,
					variables: sendTest.variableValues,
				},
			});
			const result = (response as { data?: TemplateSendTestResult }).data;
			if (!result) {
				throw new Error("발송 결과가 없습니다.");
			}
			sendTest.completeSend(result);
		} catch (error) {
			sendTest.failSend(
				error instanceof Error ? error.message : "발송 중 오류가 발생했습니다.",
			);
		}
	};

	return (
		<>
			<div className="flex flex-col gap-4">
				<TextField
					label={config.label}
					placeholder={config.placeholder}
					value={sendTest.recipient}
					onValueChange={(recipient) => sendTest.setRecipient(recipient)}
					isRequired
					size="sm"
					isDisabled={sendTest.status === "loading"}
				/>

				{sendTest.variables.length > 0 ? (
					<div className="flex flex-col gap-2">
						<p className="text-sm font-semibold text-foreground">변수 값</p>
						<VariableInputForm
							variables={sendTest.variables}
							values={sendTest.variableValues}
							onChange={(values) => sendTest.setVariableValues(values)}
						/>
					</div>
				) : null}

				{sendTest.result ? (
					<div
						className={`flex items-start gap-3 rounded-lg border p-3 ${
							sendTest.result.success
								? "border-success/30 bg-success/10"
								: "border-danger/30 bg-danger/10"
						}`}
					>
						{sendTest.result.success ? (
							<CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-success" />
						) : (
							<AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
						)}
						<div className="flex flex-col gap-1">
							{sendTest.result.success ? (
								<>
									<span className="text-sm font-medium text-success">
										발송 성공
									</span>
									<span className="text-xs text-muted">
										발송 시각: {formatTemplateSentAt(sendTest.result.sentAt)}
									</span>
								</>
							) : (
								<span className="text-sm font-medium text-danger">
									발송 실패: {sendTest.result.errorMessage}
								</span>
							)}
						</div>
					</div>
				) : null}
			</div>

			<div className="flex justify-end gap-2">
				<Button
					variant="flat"
					onPress={() => state.close()}
					isDisabled={sendTest.status === "loading"}
				>
					닫기
				</Button>
				<Button
					color="primary"
					onPress={handleSendTest}
					isDisabled={sendTest.isSendDisabled}
					startContent={
						sendTest.status !== "loading" ? (
							<Send className="h-4 w-4" />
						) : undefined
					}
				>
					발송
				</Button>
			</div>
		</>
	);
});

TemplateSendTestModal.displayName = "TemplateSendTestModal";

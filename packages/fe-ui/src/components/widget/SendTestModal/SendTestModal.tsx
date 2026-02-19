"use client";

import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import type { TemplateVariable } from "../VariableReadTable/VariableReadTable";
import { VariableInputForm } from "../VariableInputForm/VariableInputForm";

/** 발송 테스트 유형 */
type SendTestType = "EMAIL" | "SMS" | "PUSH";

/** 발송 테스트 결과 */
export interface SendTestResult {
	/** 성공 여부 */
	success: boolean;
	/** 발송 시각 */
	sentAt: string;
	/** 에러 메시지 */
	errorMessage: string | null;
}

/** 발송 상태 */
type SendTestStatus = "idle" | "loading" | "success" | "error";

export interface SendTestModalProps {
	/** 모달 열림 상태 */
	isOpen: boolean;
	/** 모달 닫기 핸들러 */
	onClose: () => void;
	/** 템플릿 ID */
	templateId: string;
	/** 템플릿 유형 */
	type: SendTestType;
	/** 변수 목록 */
	variables: TemplateVariable[];
	/** 발송 테스트 실행 핸들러 */
	onSendTest: (
		templateId: string,
		recipient: string,
		variables: Record<string, string>,
	) => Promise<SendTestResult>;
}

/** 유형별 수신자 입력 설정 */
const recipientConfig: Record<
	SendTestType,
	{ label: string; placeholder: string }
> = {
	EMAIL: { label: "이메일 주소", placeholder: "test@example.com" },
	SMS: { label: "전화번호", placeholder: "010-1234-5678" },
	PUSH: { label: "디바이스 토큰", placeholder: "디바이스 토큰 입력" },
};

/** 발송 시각 포맷팅 */
const formatSentAt = (sentAt: string): string => {
	const date = new Date(sentAt);
	return date.toLocaleString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
};

/**
 * SendTestModal 컴포넌트
 * 상세 화면에서 테스트 발송을 수행하는 모달입니다.
 * 유형(EMAIL/SMS/PUSH)에 따라 적절한 수신자 입력 필드를 표시하고,
 * 템플릿 변수 입력 폼과 발송 결과를 렌더링합니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <SendTestModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   templateId="template-1"
 *   type="EMAIL"
 *   variables={[
 *     { id: "1", name: "userName", description: "사용자 이름", defaultValue: null, isRequired: true },
 *   ]}
 *   onSendTest={handleSendTest}
 * />
 * ```
 */
export const SendTestModal = observer(
	({
		isOpen,
		onClose,
		templateId,
		type,
		variables,
		onSendTest,
	}: SendTestModalProps) => {
		const [recipient, setRecipient] = useState("");
		const [variableValues, setVariableValues] = useState<
			Record<string, string>
		>({});
		const [result, setResult] = useState<SendTestResult | null>(null);
		const [status, setStatus] = useState<SendTestStatus>("idle");

		const config = recipientConfig[type];
		const isRecipientEmpty = recipient.trim() === "";
		const isSendDisabled = isRecipientEmpty || status === "loading";

		/** 모달이 열릴 때 상태 초기화 */
		const handleOpenChange = (open: boolean) => {
			if (open) {
				setRecipient("");
				setVariableValues({});
				setResult(null);
				setStatus("idle");
			}
			if (!open) {
				onClose();
			}
		};

		/** 발송 테스트 실행 */
		const handleSendTest = async () => {
			setStatus("loading");
			setResult(null);

			try {
				const sendResult = await onSendTest(
					templateId,
					recipient,
					variableValues,
				);
				setResult(sendResult);
				setStatus(sendResult.success ? "success" : "error");
			} catch {
				setResult({
					success: false,
					sentAt: new Date().toISOString(),
					errorMessage: "발송 중 오류가 발생했습니다.",
				});
				setStatus("error");
			}
		};

		return (
			<Modal
				isOpen={isOpen}
				onOpenChange={handleOpenChange}
				size="2xl"
			>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						테스트 발송
					</ModalHeader>

					<ModalBody>
						<div className="flex flex-col gap-4">
							{/* 수신자 입력 */}
							<Input
								label={config.label}
								placeholder={config.placeholder}
								value={recipient}
								onValueChange={setRecipient}
								isRequired
								size="sm"
								isDisabled={status === "loading"}
							/>

							{/* 변수 입력 폼 */}
							{variables.length > 0 && (
								<div className="flex flex-col gap-2">
									<p className="text-sm font-semibold text-default-700">
										변수 값
									</p>
									<VariableInputForm
										variables={variables}
										values={variableValues}
										onChange={setVariableValues}
									/>
								</div>
							)}

							{/* 결과 표시 영역 */}
							{result && (
								<div
									className={`flex items-start gap-3 rounded-lg p-3 ${
										result.success
											? "bg-success/10 border border-success/30"
											: "bg-danger/10 border border-danger/30"
									}`}
								>
									{result.success ? (
										<CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-success" />
									) : (
										<AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
									)}
									<div className="flex flex-col gap-1">
										{result.success ? (
											<>
												<span className="text-sm font-medium text-success">
													발송 성공
												</span>
												<span className="text-xs text-default-500">
													발송 시각:{" "}
													{formatSentAt(result.sentAt)}
												</span>
											</>
										) : (
											<span className="text-sm font-medium text-danger">
												발송 실패: {result.errorMessage}
											</span>
										)}
									</div>
								</div>
							)}
						</div>
					</ModalBody>

					<ModalFooter>
						<Button
							variant="flat"
							onPress={onClose}
							isDisabled={status === "loading"}
						>
							닫기
						</Button>
						<Button
							color="primary"
							onPress={handleSendTest}
							isLoading={status === "loading"}
							isDisabled={isSendDisabled}
							startContent={
								status !== "loading" ? (
									<Send className="h-4 w-4" />
								) : undefined
							}
						>
							발송
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	},
);

SendTestModal.displayName = "SendTestModal";

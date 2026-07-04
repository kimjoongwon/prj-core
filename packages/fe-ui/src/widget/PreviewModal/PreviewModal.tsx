"use client";

import { Modal, Spinner, useOverlayState } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Chip } from "../../data-display/Chip/Chip";
import type { TemplateVariable } from "../../form/VariableInputForm";
import { VariableInputForm } from "../../form/VariableInputForm";
import { Button } from "../../input/Button/Button";
import { ByteCounter } from "../ByteCounter";
import { HtmlContentRenderer } from "../HtmlContentRenderer";

/** 템플릿 유형 */
type TemplateType = "EMAIL" | "SMS" | "PUSH";

/** 미리보기 결과 */
export interface PreviewResult {
	/** 템플릿 유형 */
	type: TemplateType;
	/** 제목 (EMAIL, PUSH에서 사용) */
	subject: string | null;
	/** 본문 내용 */
	content: string;
	/** 미치환 변수 목록 */
	unresolvedVariables: string[];
}

export interface PreviewModalProps {
	/** 모달 열림 상태 */
	isOpen: boolean;
	/** 모달 닫기 핸들러 */
	onClose: () => void;
	/** 템플릿 ID */
	templateId: string;
	/** 템플릿 유형 */
	type: TemplateType;
	/** 변수 목록 */
	variables: TemplateVariable[];
	/** 미리보기 실행 핸들러 */
	onPreview: (
		templateId: string,
		variables: Record<string, string>,
	) => Promise<PreviewResult>;
}

/** 미리보기 상태 */
type PreviewState = "idle" | "loading" | "success" | "error";

/**
 * 변수 목록에서 기본값 맵을 생성합니다.
 */
const buildDefaultValues = (
	variables: TemplateVariable[],
): Record<string, string> => {
	const values: Record<string, string> = {};
	for (const variable of variables) {
		values[variable.name] = variable.defaultValue ?? "";
	}
	return values;
};

/**
 * PreviewModal 컴포넌트
 *
 * 상세 화면에서 템플릿 미리보기를 수행하는 모달 위젯입니다.
 * 변수 입력 폼을 통해 값을 설정하고, 미리보기를 실행하여 결과를 확인합니다.
 *
 * - EMAIL: 제목 + HTML 본문 렌더링
 * - SMS: 본문 텍스트 + 바이트 카운터
 * - PUSH: 제목 + 본문 카드
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <PreviewModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   templateId="tpl-001"
 *   type="EMAIL"
 *   variables={variables}
 *   onPreview={handlePreview}
 * />
 * ```
 */
export const PreviewModal = observer(
	({
		isOpen,
		onClose,
		templateId,
		type: _type,
		variables,
		onPreview,
	}: PreviewModalProps) => {
		// 변수 입력값
		const [variableValues, setVariableValues] = useState<
			Record<string, string>
		>({});

		// 미리보기 결과
		const [previewResult, setPreviewResult] = useState<PreviewResult | null>(
			null,
		);

		// 미리보기 상태
		const [previewState, setPreviewState] = useState<PreviewState>("idle");

		// 에러 메시지
		const [errorMessage, setErrorMessage] = useState("");

		/**
		 * 모달이 열릴 때 변수 기본값으로 초기화합니다.
		 */
		useEffect(() => {
			if (isOpen) {
				setVariableValues(buildDefaultValues(variables));
				setPreviewResult(null);
				setPreviewState("idle");
				setErrorMessage("");
			}
		}, [isOpen, variables]);

		/**
		 * 미리보기 실행 핸들러
		 */
		const handlePreview = async () => {
			setPreviewState("loading");
			setErrorMessage("");

			try {
				const result = await onPreview(templateId, variableValues);
				setPreviewResult(result);
				setPreviewState("success");
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: "미리보기 실행 중 오류가 발생했습니다.";
				setErrorMessage(message);
				setPreviewState("error");
			}
		};

		const isLoading = previewState === "loading";
		const modalState = useOverlayState({
			isOpen,
			onOpenChange: (open) => {
				if (!open) {
					onClose();
				}
			},
		});

		return (
			<Modal state={modalState}>
				<Modal.Backdrop>
					<Modal.Container size="lg" scroll="inside">
						<Modal.Dialog>
							<Modal.Header>템플릿 미리보기</Modal.Header>
							<Modal.Body>
								<div>
									{/* 변수 입력 영역 */}
									<div className="flex flex-col">
										<span className="flex flex-col w-full gap-6 items-center justify-center text-sm font-semibold text-foreground">
											변수 입력
										</span>
										<VariableInputForm
											variables={variables}
											values={variableValues}
											onChange={setVariableValues}
										/>
									</div>

									{/* 미리보기 실행 버튼 */}
									<Button
										color="primary"
										onPress={handlePreview}
										isDisabled={isLoading}
									>
										미리보기 실행
									</Button>

									{/* 에러 메시지 */}
									{previewState === "error" && errorMessage && (
										<p className="text-sm text-danger">{errorMessage}</p>
									)}

									{/* 로딩 스피너 */}
									{isLoading && (
										<div className="flex">
											<Spinner size="lg" />
										</div>
									)}

									{/* 렌더링 결과 영역 */}
									{previewState === "success" && previewResult && (
										<div className="flex flex-col">
											{/* 미치환 변수 경고 */}
											{previewResult.unresolvedVariables.length > 0 && (
												<div className="flex flex-col">
													<span className="text-sm font-semibold text-warning">
														미치환 변수
													</span>
													<div className="flex">
														{previewResult.unresolvedVariables.map(
															(variableName) => (
																<Chip
																	key={variableName}
																	color="warning"
																	size="sm"
																	variant="flat"
																>
																	{variableName}
																</Chip>
															),
														)}
													</div>
												</div>
											)}

											{/* EMAIL 유형 결과 */}
											{previewResult.type === "EMAIL" && (
												<EmailPreviewResult
													subject={previewResult.subject}
													content={previewResult.content}
												/>
											)}

											{/* SMS 유형 결과 */}
											{previewResult.type === "SMS" && (
												<SmsPreviewResult content={previewResult.content} />
											)}

											{/* PUSH 유형 결과 */}
											{previewResult.type === "PUSH" && (
												<PushPreviewResult
													subject={previewResult.subject}
													content={previewResult.content}
												/>
											)}
										</div>
									)}
								</div>
							</Modal.Body>
							<Modal.Footer>
								<Button variant="flat" onPress={onClose}>
									닫기
								</Button>
							</Modal.Footer>
						</Modal.Dialog>
					</Modal.Container>
				</Modal.Backdrop>
			</Modal>
		);
	},
);

PreviewModal.displayName = "PreviewModal";

// --- 유형별 결과 렌더링 컴포넌트 ---

interface EmailPreviewResultProps {
	subject: string | null;
	content: string;
}

/**
 * EMAIL 유형의 미리보기 결과를 렌더링합니다.
 */
const EmailPreviewResult = observer(
	({ subject, content }: EmailPreviewResultProps) => {
		return (
			<div className="flex flex-col">
				<span className="text-sm font-semibold text-foreground">
					미리보기 결과
				</span>
				{subject && (
					<div className="flex flex-col">
						<span className="text-xs text-muted">제목</span>
						<span className="text-sm text-foreground">{subject}</span>
					</div>
				)}
				<div className="flex flex-col">
					<span className="text-xs text-muted">본문</span>
					<HtmlContentRenderer html={content} />
				</div>
			</div>
		);
	},
);

EmailPreviewResult.displayName = "EmailPreviewResult";

interface SmsPreviewResultProps {
	content: string;
}

/**
 * SMS 유형의 미리보기 결과를 렌더링합니다.
 */
const SmsPreviewResult = observer(({ content }: SmsPreviewResultProps) => {
	return (
		<div className="flex flex-col">
			<div className="flex">
				<span className="text-sm font-semibold text-foreground">
					미리보기 결과
				</span>
				<ByteCounter text={content} />
			</div>
			<div className="rounded-lg border border-border bg-surface-secondary p-4">
				<p className="text-sm text-foreground whitespace-pre-wrap">{content}</p>
			</div>
		</div>
	);
});

SmsPreviewResult.displayName = "SmsPreviewResult";

interface PushPreviewResultProps {
	subject: string | null;
	content: string;
}

/**
 * PUSH 유형의 미리보기 결과를 렌더링합니다.
 */
const PushPreviewResult = observer(
	({ subject, content }: PushPreviewResultProps) => {
		return (
			<div className="flex flex-col gap-3">
				<span className="text-sm font-semibold text-foreground">
					미리보기 결과
				</span>
				<div className="rounded-lg border border-border bg-surface-secondary p-4">
					<div className="flex flex-col gap-2">
						{subject && (
							<span className="text-sm font-semibold text-foreground">
								{subject}
							</span>
						)}
						<p className="text-sm text-muted whitespace-pre-wrap">{content}</p>
					</div>
				</div>
			</div>
		);
	},
);

PushPreviewResult.displayName = "PushPreviewResult";

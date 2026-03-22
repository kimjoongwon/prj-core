"use client";

import {
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { VStack } from "../../layout/VStack/VStack";
import { HStack } from "../../layout/HStack/HStack";
import { VariableInputForm } from "../form/VariableInputForm";
import type { TemplateVariable } from "../VariableReadTable";
import { HtmlContentRenderer } from "../HtmlContentRenderer";
import { ByteCounter } from "../ByteCounter";

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
		type,
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

		return (
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size="3xl"
				scrollBehavior="inside"
			>
				<ModalContent>
					<ModalHeader>템플릿 미리보기</ModalHeader>
					<ModalBody>
						<VStack gap={6}>
							{/* 변수 입력 영역 */}
							<VStack gap={2}>
								<span className="text-sm font-semibold text-foreground">
									변수 입력
								</span>
								<VariableInputForm
									variables={variables}
									values={variableValues}
									onChange={setVariableValues}
								/>
							</VStack>

							{/* 미리보기 실행 버튼 */}
							<Button
								color="primary"
								onPress={handlePreview}
								isLoading={isLoading}
								isDisabled={isLoading}
								fullWidth
							>
								미리보기 실행
							</Button>

							{/* 에러 메시지 */}
							{previewState === "error" && errorMessage && (
								<p className="text-sm text-danger">{errorMessage}</p>
							)}

							{/* 로딩 스피너 */}
							{isLoading && (
								<HStack justifyContent="center">
									<Spinner size="lg" />
								</HStack>
							)}

							{/* 렌더링 결과 영역 */}
							{previewState === "success" && previewResult && (
								<VStack gap={4}>
									{/* 미치환 변수 경고 */}
									{previewResult.unresolvedVariables.length > 0 && (
										<VStack gap={2}>
											<span className="text-sm font-semibold text-warning">
												미치환 변수
											</span>
											<HStack gap={2}>
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
											</HStack>
										</VStack>
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
								</VStack>
							)}
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button variant="flat" onPress={onClose}>
							닫기
						</Button>
					</ModalFooter>
				</ModalContent>
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
			<VStack gap={3}>
				<span className="text-sm font-semibold text-foreground">
					미리보기 결과
				</span>
				{subject && (
					<VStack gap={1}>
						<span className="text-xs text-default-500">제목</span>
						<span className="text-sm text-foreground">{subject}</span>
					</VStack>
				)}
				<VStack gap={1}>
					<span className="text-xs text-default-500">본문</span>
					<HtmlContentRenderer html={content} />
				</VStack>
			</VStack>
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
		<VStack gap={3}>
			<HStack justifyContent="between" alignItems="center">
				<span className="text-sm font-semibold text-foreground">
					미리보기 결과
				</span>
				<ByteCounter text={content} />
			</HStack>
			<div className="rounded-lg border border-divider bg-content2 p-4">
				<p className="text-sm text-foreground whitespace-pre-wrap">{content}</p>
			</div>
		</VStack>
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
			<VStack gap={3}>
				<span className="text-sm font-semibold text-foreground">
					미리보기 결과
				</span>
				<div className="rounded-lg border border-divider bg-content2 p-4">
					<VStack gap={2}>
						{subject && (
							<span className="text-sm font-semibold text-foreground">
								{subject}
							</span>
						)}
						<p className="text-sm text-default-600 whitespace-pre-wrap">
							{content}
						</p>
					</VStack>
				</div>
			</VStack>
		);
	},
);

PushPreviewResult.displayName = "PushPreviewResult";

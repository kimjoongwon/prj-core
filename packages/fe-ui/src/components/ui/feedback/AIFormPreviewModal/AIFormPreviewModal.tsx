"use client";

import { observer } from "mobx-react-lite";
import { useState, useMemo } from "react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Select,
	SelectItem,
	Textarea,
	Chip,
	Spinner,
} from "@heroui/react";
import { HStack } from "../../surfaces/HStack/HStack";
import { VStack } from "../../surfaces/VStack/VStack";
import { Text } from "../../data-display/Text/Text";
import { Button } from "../../../inputs/Button/Button";

export interface AIFormPreviewModalProps {
	/** 모달 열림 여부 */
	isOpen: boolean;
	/** 모달 닫기 핸들러 */
	onClose: () => void;
	/** 적용 핸들러 (수정된 값 전달) */
	onConfirm: (editedValues: Record<string, unknown>) => void;
	/** 기존 값들 */
	originalValues: Record<string, unknown>;
	/** AI가 제안한 값들 */
	aiValues: Record<string, unknown>;
	/** AI가 채운 필드 목록 */
	appliedFields: string[];
	/** 필드별 신뢰도 */
	confidence: Record<string, number>;
	/** 필드 라벨 매핑 */
	fieldLabels: Record<string, string>;
	/** 로딩 상태 */
	isLoading?: boolean;
}

/**
 * AI 폼 미리보기 모달 컴포넌트
 * AI가 생성한 폼 필드 값을 미리보기하고 수정할 수 있습니다.
 *
 * @example
 * ```tsx
 * <AIFormPreviewModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={(values) => handleApply(values)}
 *   originalValues={{ title: "", priority: "medium" }}
 *   aiValues={{ title: "AI 제안 제목", priority: "high" }}
 *   appliedFields={["title", "priority"]}
 *   confidence={{ title: 95, priority: 88 }}
 *   fieldLabels={{ title: "제목", priority: "우선순위" }}
 * />
 * ```
 */
export const AIFormPreviewModal = observer(
	({
		isOpen,
		onClose,
		onConfirm,
		originalValues,
		aiValues,
		appliedFields,
		confidence,
		fieldLabels,
		isLoading = false,
	}: AIFormPreviewModalProps) => {
		const [editedValues, setEditedValues] = useState<Record<string, unknown>>(
			() => ({ ...aiValues })
		);

		// 신뢰도에 따른 색상 반환
		const getConfidenceColor = (value: number): "success" | "warning" | "danger" => {
			if (value >= 80) return "success";
			if (value >= 50) return "warning";
			return "danger";
		};

		// 신뢰도 아이콘 반환
		const getConfidenceIcon = (value: number): string => {
			if (value >= 80) return "🟢";
			if (value >= 50) return "🟡";
			return "🔴";
		};

		// 값 변경 핸들러
		const handleValueChange = (fieldName: string, value: unknown) => {
			setEditedValues((prev) => ({
				...prev,
				[fieldName]: value,
			}));
		};

		// 적용 핸들러
		const handleConfirm = () => {
			onConfirm(editedValues);
		};

		// 표시할 필드 목록
		const displayFields = useMemo(() => {
			return appliedFields.map((fieldName) => ({
				fieldName,
				label: fieldLabels[fieldName] ?? fieldName,
				originalValue: originalValues[fieldName],
				aiValue: aiValues[fieldName],
				confidence: confidence[fieldName] ?? 0,
			}));
		}, [appliedFields, fieldLabels, originalValues, aiValues, confidence]);

		// 값 표시 포맷
		const formatValue = (value: unknown): string => {
			if (value === null || value === undefined || value === "") {
				return "(비어있음)";
			}
			if (typeof value === "object") {
				return JSON.stringify(value);
			}
			return String(value);
		};

		return (
			<Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
				<ModalContent>
					<ModalHeader>
						<Text variant="h6">AI 생성 결과 미리보기</Text>
					</ModalHeader>
					<ModalBody>
						<VStack gap={4}>
							<Text variant="body2" className="text-default-500">
								AI가 채운 필드만 표시됩니다. 필요시 수정 후 적용하세요.
							</Text>

							{isLoading ? (
								<VStack alignItems="center" justifyContent="center" className="py-12">
									<Spinner size="lg" color="primary" />
									<Text variant="body2" className="mt-4 text-default-500">
										AI가 결과를 생성 중입니다...
									</Text>
								</VStack>
							) : displayFields.length === 0 ? (
								<VStack alignItems="center" justifyContent="center" className="py-12">
									<Text variant="body2" className="text-default-500">
										AI가 채운 필드가 없습니다.
									</Text>
								</VStack>
							) : (
								<div className="overflow-x-auto">
									<table className="w-full border-collapse">
										<thead>
											<tr className="border-b border-divider bg-content2">
												<th className="px-4 py-3 text-left text-sm font-semibold">
													필드
												</th>
												<th className="px-4 py-3 text-left text-sm font-semibold">
													기존 값
												</th>
												<th className="px-4 py-3 text-left text-sm font-semibold">
													AI 제안 값
												</th>
												<th className="px-4 py-3 text-center text-sm font-semibold">
													신뢰도
												</th>
											</tr>
										</thead>
										<tbody>
											{displayFields.map(
												({ fieldName, label, originalValue, aiValue, confidence: conf }) => (
													<tr
														key={fieldName}
														className="border-b border-divider hover:bg-content2"
													>
														<td className="px-4 py-3 text-sm font-medium">
															{label}
														</td>
														<td className="px-4 py-3 text-sm text-default-500">
															{formatValue(originalValue)}
														</td>
														<td className="px-4 py-3">
															{typeof aiValue === "string" && aiValue.length > 50 ? (
																<Textarea
																	value={String(editedValues[fieldName] ?? "")}
																	onChange={(e) =>
																		handleValueChange(fieldName, e.target.value)
																	}
																	minRows={2}
																	maxRows={4}
																	className="min-w-[200px]"
																/>
															) : typeof aiValue === "boolean" ? (
																<Select
																	selectedKeys={[
																		String(editedValues[fieldName] ?? aiValue),
																	]}
																	onChange={(e) =>
																		handleValueChange(fieldName, e.target.value === "true")
																	}
																	className="min-w-[120px]"
																>
																	<SelectItem key="true">예</SelectItem>
																	<SelectItem key="false">아니오</SelectItem>
																</Select>
															) : (
																<input
																	type="text"
																	value={String(editedValues[fieldName] ?? "")}
																	onChange={(e) =>
																		handleValueChange(fieldName, e.target.value)
																	}
																	className="min-w-[200px] rounded-lg border border-default-200 bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
																/>
															)}
														</td>
														<td className="px-4 py-3 text-center">
															<Chip
																size="sm"
																color={getConfidenceColor(conf)}
																variant="flat"
															>
																{conf}% {getConfidenceIcon(conf)}
															</Chip>
														</td>
													</tr>
												)
											)}
										</tbody>
									</table>
								</div>
							)}
						</VStack>
					</ModalBody>
					<ModalFooter>
						<HStack gap={3} justifyContent="end">
							<Button variant="bordered" onPress={onClose}>
								취소
							</Button>
							<Button
								color="primary"
								onPress={handleConfirm}
								isDisabled={isLoading || displayFields.length === 0}
							>
								적용
							</Button>
						</HStack>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}
);

AIFormPreviewModal.displayName = "AIFormPreviewModal";

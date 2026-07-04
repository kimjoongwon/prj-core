"use client";

import { Table, Tooltip } from "@heroui/react";
import { Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../input/Button/Button";
import { Switch } from "../../input/Switch/Switch";
import { TextField } from "../../input/TextField/TextField";

/** 변수 편집 항목 */
export interface VariableEditItem {
	/** 기존 변수 ID (수정 시) */
	id?: string;
	/** 변수명 (camelCase) */
	name: string;
	/** 설명 */
	description: string;
	/** 기본값 */
	defaultValue: string;
	/** 필수 여부 */
	isRequired: boolean;
}

export interface VariableEditTableProps {
	/** 변수 목록 */
	variables: VariableEditItem[];
	/** 변수 변경 핸들러 */
	onChange: (variables: VariableEditItem[]) => void;
	/** 본문 텍스트 (정합성 검증용, 선택적) */
	contentText?: string;
	/** 행별 필드별 에러 (선택적) */
	errors?: Record<number, Record<string, string>>;
	/** 읽기 전용 여부 */
	readOnly?: boolean;
}

/** 변수명 유효성 검증 정규식 */
const VARIABLE_NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9]*$/;

/** 컬럼 정의 */
const COLUMNS = [
	{ key: "name", label: "변수명", width: 160 },
	{ key: "description", label: "설명", width: 200 },
	{ key: "defaultValue", label: "기본값", width: 150 },
	{ key: "isRequired", label: "필수", width: 80 },
	{ key: "actions", label: "", width: 60 },
] as const;

/**
 * 본문에서 해당 변수가 사용 중인지 확인합니다.
 */
const isVariableUsedInContent = (
	variableName: string,
	contentText?: string,
): boolean => {
	if (!contentText || !variableName) return false;
	return contentText.includes(`{{${variableName}}}`);
};

/**
 * VariableEditTable 컴포넌트
 * 등록/수정 폼에서 변수를 인라인으로 추가/수정/삭제하는 테이블입니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <VariableEditTable
 *   variables={variables}
 *   onChange={setVariables}
 *   contentText={bodyContent}
 *   errors={{ 0: { name: "영문으로 시작해야 합니다" } }}
 * />
 * ```
 */
export const VariableEditTable = observer(
	({
		variables,
		onChange,
		contentText,
		errors,
		readOnly = false,
	}: VariableEditTableProps) => {
		/**
		 * 행 추가 핸들러
		 */
		const handleAddRow = () => {
			if (readOnly) {
				return;
			}
			onChange([
				...variables,
				{
					name: "",
					description: "",
					defaultValue: "",
					isRequired: false,
				},
			]);
		};

		/**
		 * 행 필드 변경 핸들러
		 */
		const handleFieldChange = (
			index: number,
			field: keyof Omit<VariableEditItem, "id">,
			value: string | number | boolean,
		) => {
			if (readOnly) {
				return;
			}
			const updated = variables.map((item, i) => {
				if (i !== index) return item;
				return { ...item, [field]: value };
			});
			onChange(updated);
		};

		/**
		 * 행 삭제 핸들러
		 */
		const handleDeleteRow = (index: number) => {
			if (readOnly) {
				return;
			}
			onChange(variables.filter((_, i) => i !== index));
		};

		/**
		 * 특정 행/필드의 에러 메시지를 가져옵니다.
		 */
		const getError = (rowIndex: number, field: string): string | undefined => {
			return errors?.[rowIndex]?.[field];
		};

		/**
		 * 삭제 버튼 렌더링 (본문 사용 여부에 따라 Tooltip 표시)
		 */
		const renderDeleteButton = (variable: VariableEditItem, index: number) => {
			const isUsed = isVariableUsedInContent(variable.name, contentText);

			const deleteButton = (
				<Button
					isIconOnly
					variant="light"
					color="danger"
					size="sm"
					isDisabled={readOnly}
					onPress={() => handleDeleteRow(index)}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			);

			if (isUsed) {
				return (
					<Tooltip>
						<Tooltip.Trigger>{deleteButton}</Tooltip.Trigger>
						<Tooltip.Content placement="top">
							본문에서 사용 중인 변수입니다
						</Tooltip.Content>
					</Tooltip>
				);
			}

			return deleteButton;
		};

		return (
			<div className="flex flex-col gap-3">
				<Table aria-label="변수 편집 테이블">
					<Table.Content>
						<Table.Header>
							{COLUMNS.map((column) => (
								<Table.Column key={column.key} width={column.width}>
									{column.label}
								</Table.Column>
							))}
						</Table.Header>
						<Table.Body>
							{variables.map((variable, index) => {
								const nameError = getError(index, "name");
								const descriptionError = getError(index, "description");
								const defaultValueError = getError(index, "defaultValue");

								return (
									<Table.Row key={variable.id ?? `new-${index}`}>
										<Table.Cell>
											<TextField
												size="sm"
												placeholder="변수명"
												value={variable.name}
												onChange={(value) =>
													handleFieldChange(index, "name", value)
												}
												isInvalid={!!nameError}
												errorMessage={nameError}
												pattern={VARIABLE_NAME_PATTERN.source}
												isReadOnly={readOnly}
												isDisabled={readOnly}
											/>
										</Table.Cell>
										<Table.Cell>
											<TextField
												size="sm"
												placeholder="설명"
												value={variable.description}
												onChange={(value) =>
													handleFieldChange(index, "description", value)
												}
												isInvalid={!!descriptionError}
												errorMessage={descriptionError}
												isReadOnly={readOnly}
												isDisabled={readOnly}
											/>
										</Table.Cell>
										<Table.Cell>
											<TextField
												size="sm"
												placeholder="기본값"
												value={variable.defaultValue}
												onChange={(value) =>
													handleFieldChange(index, "defaultValue", value)
												}
												isInvalid={!!defaultValueError}
												errorMessage={defaultValueError}
												isReadOnly={readOnly}
												isDisabled={readOnly}
											/>
										</Table.Cell>
										<Table.Cell>
											<Switch
												size="sm"
												value={variable.isRequired}
												isDisabled={readOnly}
												onValueChange={(isSelected) =>
													handleFieldChange(index, "isRequired", isSelected)
												}
											/>
										</Table.Cell>
										<Table.Cell>
											{readOnly ? null : renderDeleteButton(variable, index)}
										</Table.Cell>
									</Table.Row>
								);
							})}
						</Table.Body>
					</Table.Content>
				</Table>

				{readOnly ? null : (
					<Button
						variant="light"
						startContent={<Plus className="h-4 w-4" />}
						onPress={handleAddRow}
						size="sm"
					>
						변수 추가
					</Button>
				)}
			</div>
		);
	},
);

VariableEditTable.displayName = "VariableEditTable";

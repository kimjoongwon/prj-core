"use client";

import { Table } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";

/** 템플릿 변수 정보 */
export interface TemplateVariable {
	id: string;
	name: string;
	description: string | null;
	defaultValue: string | null;
	isRequired: boolean;
}

export interface VariableReadTableProps {
	/** 변수 목록 */
	variables: TemplateVariable[];
}

const COLUMNS = [
	{ key: "name", label: "변수명" },
	{ key: "description", label: "설명" },
	{ key: "defaultValue", label: "기본값" },
	{ key: "isRequired", label: "필수" },
] as const;

/**
 * VariableReadTable 컴포넌트
 * 상세 화면에서 변수 목록을 읽기 전용으로 표시합니다.
 *
 * @example
 * ```tsx
 * <VariableReadTable
 *   variables={[
 *     { id: "1", name: "userName", description: "사용자 이름", defaultValue: "고객", isRequired: true },
 *     { id: "2", name: "orderNo", description: "주문번호", defaultValue: null, isRequired: true },
 *   ]}
 * />
 * ```
 */
export const VariableReadTable = observer(
	({ variables }: VariableReadTableProps) => {
		const renderCell = (variable: TemplateVariable, columnKey: string) => {
			switch (columnKey) {
				case "name":
					return (
						<span className="font-mono text-sm">{`{{${variable.name}}}`}</span>
					);
				case "description":
					return variable.description ?? <span className="text-muted">-</span>;
				case "defaultValue":
					return variable.defaultValue ?? <span className="text-muted">-</span>;
				case "isRequired":
					return variable.isRequired ? (
						<Chip size="sm" color="primary" variant="flat">
							필수
						</Chip>
					) : (
						<Chip size="sm" variant="flat">
							선택
						</Chip>
					);
				default:
					return null;
			}
		};

		return (
			<Table aria-label="변수 목록">
				<Table.Content>
					<Table.Header>
						{COLUMNS.map((column) => (
							<Table.Column key={column.key}>{column.label}</Table.Column>
						))}
					</Table.Header>
					<Table.Body items={variables}>
						{(variable) => (
							<Table.Row key={variable.id}>
								{(columnKey) => (
									<Table.Cell>
										{renderCell(variable, columnKey as unknown as string)}
									</Table.Cell>
								)}
							</Table.Row>
						)}
					</Table.Body>
				</Table.Content>
			</Table>
		);
	},
);

VariableReadTable.displayName = "VariableReadTable";

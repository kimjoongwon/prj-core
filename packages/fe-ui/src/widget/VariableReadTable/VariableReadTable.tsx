"use client";

import {
	Chip,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";

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
					return (
						variable.description ?? <span className="text-default-400">-</span>
					);
				case "defaultValue":
					return (
						variable.defaultValue ?? <span className="text-default-400">-</span>
					);
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
			<Table aria-label="변수 목록" removeWrapper isStriped>
				<TableHeader>
					{COLUMNS.map((column) => (
						<TableColumn key={column.key}>{column.label}</TableColumn>
					))}
				</TableHeader>
				<TableBody items={variables} emptyContent="정의된 변수가 없습니다.">
					{(variable) => (
						<TableRow key={variable.id}>
							{(columnKey) => (
								<TableCell>
									{renderCell(variable, columnKey as string)}
								</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>
		);
	},
);

VariableReadTable.displayName = "VariableReadTable";

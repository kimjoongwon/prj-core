"use client";

import {
	Chip,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { observer } from "mobx-react-lite";
import {
	VisibilityCell,
	type VisibilityStatus,
} from "../../../ui/permission/VisibilityCell";
import { HStack } from "../../../layouts/HStack/HStack";
import { VStack } from "../../../layouts/VStack/VStack";

/**
 * 매트릭스 셀 타입
 */
export interface MatrixCell {
	/** 필드 이름 */
	fieldName: string;
	/** 역할 이름 */
	roleName: string;
	/** 가시성 상태 */
	status: VisibilityStatus;
	/** Ability ID (수정 시 사용) */
	abilityId?: string;
}

/**
 * 필드 정보
 */
export interface MatrixField {
	/** 필드 식별자 */
	name: string;
	/** 표시명 */
	displayName?: string;
}

/**
 * 역할 정보
 */
export interface MatrixRole {
	/** 역할 ID */
	id: string;
	/** 역할 식별자 */
	name: string;
	/** 표시명 */
	displayName?: string;
}

export interface AbilityMatrixViewProps {
	/** Subject 식별자 */
	subjectName: string;
	/** Subject 표시명 */
	subjectDisplayName?: string;
	/** 필드 목록 (행) */
	fields: MatrixField[];
	/** 역할 목록 (열) */
	roles: MatrixRole[];
	/** 매트릭스 데이터 */
	matrix: MatrixCell[];
	/** 편집 가능 여부 */
	editable?: boolean;
	/** 셀 상태 변경 핸들러 */
	onCellChange?: (
		fieldName: string,
		roleName: string,
		status: VisibilityStatus,
	) => void;
	/** 로딩 상태 */
	loading?: boolean;
}

/**
 * 범례 항목 설정
 */
const legendItems: Array<{
	status: VisibilityStatus;
	icon: React.ReactNode;
	color: "success" | "warning" | "danger";
	label: string;
}> = [
	{
		status: "full",
		icon: <CheckCircle size={14} />,
		color: "success",
		label: "전체 공개",
	},
	{
		status: "masked",
		icon: <AlertTriangle size={14} />,
		color: "warning",
		label: "부분 마스킹",
	},
	{
		status: "hidden",
		icon: <XCircle size={14} />,
		color: "danger",
		label: "숨김",
	},
];

/**
 * AbilityMatrixView Widget 컴포넌트
 *
 * Subject-Action 권한 매트릭스를 표시하는 위젯입니다.
 * 행은 필드 목록, 열은 역할 목록으로 구성되며
 * 각 셀은 가시성 상태를 표시합니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <AbilityMatrixView
 *   subjectName="user"
 *   subjectDisplayName="사용자"
 *   fields={[
 *     { name: "name", displayName: "이름" },
 *     { name: "email", displayName: "이메일" },
 *   ]}
 *   roles={[
 *     { id: "1", name: "ADMIN", displayName: "관리자" },
 *     { id: "2", name: "USER", displayName: "사용자" },
 *   ]}
 *   matrix={[
 *     { fieldName: "name", roleName: "ADMIN", status: "full" },
 *     { fieldName: "email", roleName: "USER", status: "masked" },
 *   ]}
 *   editable
 *   onCellChange={(field, role, status) => console.log(field, role, status)}
 * />
 * ```
 */
export const AbilityMatrixView = observer(
	({
		subjectName,
		subjectDisplayName,
		fields,
		roles,
		matrix,
		editable = false,
		onCellChange,
		loading = false,
	}: AbilityMatrixViewProps) => {
		/**
		 * 특정 필드와 역할에 해당하는 셀 상태를 가져옵니다
		 */
		const getCellStatus = (
			fieldName: string,
			roleName: string,
		): VisibilityStatus => {
			const cell = matrix.find(
				(c) => c.fieldName === fieldName && c.roleName === roleName,
			);
			// 기본값: hidden (정의되지 않은 경우)
			return cell?.status ?? "hidden";
		};

		/**
		 * 셀 상태 변경 핸들러
		 */
		const handleCellStatusChange = (
			fieldName: string,
			roleName: string,
			status: VisibilityStatus,
		) => {
			onCellChange?.(fieldName, roleName, status);
		};

		/**
		 * 필드 표시명 가져오기
		 */
		const getFieldDisplayName = (field: MatrixField) => {
			return field.displayName ?? field.name;
		};

		/**
		 * 역할 표시명 가져오기
		 */
		const getRoleDisplayName = (role: MatrixRole) => {
			return role.displayName ?? role.name;
		};

		return (
			<VStack gap={4} fullWidth>
				{/* 헤더: Subject 이름 */}
				<HStack alignItems="center" gap={2}>
					<span className="text-lg font-semibold">
						{subjectDisplayName ?? subjectName}
					</span>
					<span className="text-default-400 text-sm">({subjectName})</span>
				</HStack>

				{/* 범례 */}
				<HStack gap={4} alignItems="center">
					<span className="text-sm text-default-500">범례:</span>
					{legendItems.map((item) => (
						<Chip
							key={item.status}
							color={item.color}
							size="sm"
							variant="flat"
							startContent={item.icon}
						>
							{item.label}
						</Chip>
					))}
				</HStack>

				{/* 매트릭스 테이블 */}
				<Table
					aria-label={`${subjectDisplayName ?? subjectName} 권한 매트릭스`}
					classNames={{
						wrapper: "min-h-[200px]",
						th: "text-center",
						td: "text-center",
					}}
					isStriped
				>
					<TableHeader>
						<TableColumn
							key="field"
							className="sticky left-0 bg-content1 z-10 min-w-[120px]"
						>
							필드명
						</TableColumn>
						{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
						{
							roles.map((role) => (
								<TableColumn key={role.id} className="min-w-[100px]">
									<VStack gap={1} alignItems="center">
										<span className="font-medium">
											{getRoleDisplayName(role)}
										</span>
										<span className="text-xs text-default-400">
											({role.name})
										</span>
									</VStack>
								</TableColumn>
							)) as any
						}
					</TableHeader>
					<TableBody
						emptyContent={loading ? " " : "필드 정보가 없습니다."}
						isLoading={loading}
						loadingContent={<Spinner label="로딩 중..." />}
					>
						{fields.map((field) => (
							<TableRow key={field.name}>
								<TableCell className="sticky left-0 bg-content1 z-10 font-medium">
									<VStack gap={1} alignItems="start">
										<span>{getFieldDisplayName(field)}</span>
										{field.displayName && (
											<span className="text-xs text-default-400">
												({field.name})
											</span>
										)}
									</VStack>
								</TableCell>
								{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
								{
									roles.map((role) => {
										const status = getCellStatus(field.name, role.name);
										return (
											<TableCell key={`${field.name}-${role.name}`}>
												<HStack justifyContent="center">
													<VisibilityCell
														status={status}
														fieldName={getFieldDisplayName(field)}
														roleName={getRoleDisplayName(role)}
														editable={editable}
														onStatusChange={(newStatus) =>
															handleCellStatusChange(
																field.name,
																role.name,
																newStatus,
															)
														}
													/>
												</HStack>
											</TableCell>
										);
									}) as any
								}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</VStack>
		);
	},
);

AbilityMatrixView.displayName = "AbilityMatrixView";

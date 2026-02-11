"use client";

import {
	Button,
	Chip,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip,
} from "@heroui/react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Switch } from "../../../inputs/Switch/Switch";
import { HStack } from "../../../ui/surfaces/HStack/HStack";
import { VStack } from "../../../ui/surfaces/VStack/VStack";

/**
 * Ability 규칙 타입
 */
export interface AbilityRule {
	/** 규칙 고유 ID */
	id: string;
	/** 규칙 이름 */
	name?: string;
	/** Subject 식별자 */
	subjectName: string;
	/** Subject 표시명 */
	subjectDisplayName?: string;
	/** Action 식별자 */
	actionName: string;
	/** Action 표시명 */
	actionDisplayName?: string;
	/** 허용(false) / 거부(true) 여부 */
	inverted: boolean;
	/** 필드 목록 */
	fields: string[];
	/** 조건 */
	conditions?: Record<string, unknown>;
	/** 활성화 상태 */
	isActive: boolean;
	/** 우선순위 */
	priority: number;
}

export interface AbilityRuleListProps {
	/** 규칙 목록 */
	rules: AbilityRule[];
	/** 로딩 상태 */
	loading?: boolean;
	/** 규칙 추가 핸들러 */
	onAddRule?: () => void;
	/** 규칙 수정 핸들러 */
	onEditRule?: (rule: AbilityRule) => void;
	/** 규칙 삭제 핸들러 */
	onDeleteRule?: (ruleId: string) => void;
	/** 활성화 상태 토글 핸들러 */
	onToggleActive?: (ruleId: string, isActive: boolean) => void;
}

/**
 * AbilityRuleList Widget 컴포넌트
 *
 * Ability 규칙 목록을 테이블 형태로 표시하는 위젯입니다.
 * 각 규칙의 Subject, Action, 조건, 상태를 표시하며
 * 규칙 추가/수정/삭제/활성화 토글 기능을 제공합니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <AbilityRuleList
 *   rules={rules}
 *   loading={isLoading}
 *   onAddRule={handleAddRule}
 *   onEditRule={handleEditRule}
 *   onDeleteRule={handleDeleteRule}
 *   onToggleActive={handleToggleActive}
 * />
 * ```
 */
export const AbilityRuleList = observer(
	({
		rules,
		loading = false,
		onAddRule,
		onEditRule,
		onDeleteRule,
		onToggleActive,
	}: AbilityRuleListProps) => {
		/**
		 * Subject 텍스트 포맷팅
		 */
		const formatSubject = (rule: AbilityRule) => {
			const displayName = rule.subjectDisplayName || rule.subjectName;
			// 긴 텍스트는 말줄임표 처리
			if (displayName.length > 20) {
				return `${displayName.substring(0, 17)}...`;
			}
			return displayName;
		};

		/**
		 * Action 텍스트 포맷팅
		 */
		const formatAction = (rule: AbilityRule) => {
			const displayName = rule.actionDisplayName || rule.actionName;
			// 필드가 있으면 함께 표시
			if (rule.fields.length > 0) {
				return `${displayName}:${rule.fields.join(",")}`;
			}
			return displayName;
		};

		/**
		 * 조건 표시 텍스트
		 */
		const formatConditions = (rule: AbilityRule) => {
			if (!rule.conditions || Object.keys(rule.conditions).length === 0) {
				return "-";
			}
			return "있음";
		};

		/**
		 * 활성화 상태 토글 핸들러
		 */
		const handleToggleActive = (ruleId: string, currentValue: boolean) => {
			onToggleActive?.(ruleId, !currentValue);
		};

		return (
			<VStack gap={4}>
				{/* 상단 액션 바 */}
				{onAddRule && (
					<HStack justifyContent="end">
						<Button
							color="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onAddRule}
						>
							규칙 추가
						</Button>
					</HStack>
				)}

				{/* 규칙 테이블 */}
				<Table
					aria-label="Ability 규칙 목록"
					classNames={{
						wrapper: "min-h-[200px]",
					}}
				>
					<TableHeader>
						<TableColumn key="priority" width={50}>
							#
						</TableColumn>
						<TableColumn key="name" width={120}>
							이름
						</TableColumn>
						<TableColumn key="subject" width={150}>
							Subject
						</TableColumn>
						<TableColumn key="action" width={180}>
							Action
						</TableColumn>
						<TableColumn key="conditions" width={80}>
							조건
						</TableColumn>
						<TableColumn key="status" width={80}>
							상태
						</TableColumn>
						<TableColumn key="actions" width={100}>
							작업
						</TableColumn>
					</TableHeader>
					<TableBody
						emptyContent={loading ? " " : "등록된 규칙이 없습니다."}
						isLoading={loading}
						loadingContent={<Spinner label="로딩 중..." />}
					>
						{rules.map((rule) => (
							<TableRow
								key={rule.id}
								className={rule.inverted ? "bg-danger/10" : undefined}
							>
								<TableCell>{rule.priority}</TableCell>
								<TableCell>
									<HStack alignItems="center" gap={2}>
										{rule.inverted && (
											<Chip color="danger" size="sm" variant="flat">
												거부
											</Chip>
										)}
										<span className="truncate">{rule.name || "-"}</span>
									</HStack>
								</TableCell>
								<TableCell>
									<Tooltip content={rule.subjectName} placement="top">
										<span className="truncate cursor-default">
											{formatSubject(rule)}
										</span>
									</Tooltip>
								</TableCell>
								<TableCell>
									<Tooltip
										content={
											rule.fields.length > 0
												? `${rule.actionName} (필드: ${rule.fields.join(", ")})`
												: rule.actionName
										}
										placement="top"
									>
										<span className="truncate cursor-default">
											{formatAction(rule)}
										</span>
									</Tooltip>
								</TableCell>
								<TableCell>
									{rule.conditions &&
									Object.keys(rule.conditions).length > 0 ? (
										<Tooltip
											content={
												<pre className="text-xs">
													{JSON.stringify(rule.conditions, null, 2)}
												</pre>
											}
											placement="top"
										>
											<Chip
												color="secondary"
												size="sm"
												variant="flat"
												className="cursor-pointer"
											>
												{formatConditions(rule)}
											</Chip>
										</Tooltip>
									) : (
										<span className="text-default-400">
											{formatConditions(rule)}
										</span>
									)}
								</TableCell>
								<TableCell>
									<Switch
										size="sm"
										value={rule.isActive}
										onValueChange={() =>
											handleToggleActive(rule.id, rule.isActive)
										}
									/>
								</TableCell>
								<TableCell>
									<HStack gap={1}>
										{onEditRule && (
											<Tooltip content="수정">
												<Button
													isIconOnly
													size="sm"
													variant="light"
													onPress={() => onEditRule(rule)}
												>
													<Edit2 className="h-4 w-4" />
												</Button>
											</Tooltip>
										)}
										{onDeleteRule && (
											<Tooltip content="삭제" color="danger">
												<Button
													isIconOnly
													size="sm"
													variant="light"
													color="danger"
													onPress={() => onDeleteRule(rule.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</Tooltip>
										)}
									</HStack>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</VStack>
		);
	},
);

AbilityRuleList.displayName = "AbilityRuleList";

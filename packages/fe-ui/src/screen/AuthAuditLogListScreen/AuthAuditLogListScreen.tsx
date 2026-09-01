"use client";

import type { AuthAuditLogDto } from "@cocrepo/api/core/auth";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildAuthAuditLogTableColumns,
	DataGrid,
	DataGridState,
	Screen,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Card } from "@heroui/react";
import { CheckCircle, Lock, XCircle } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type ReactNode, useEffect } from "react";

/** 좌측 입력 정의 */
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "email",
		placeholder: "이메일로 검색...",
	},
];
export const idpConsoleAuthAuditLogsPageQueryInputs = [...leftInputs];
export interface AuthAuditLogListScreenQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	email: string;
}
export type AuthAuditLogListScreenSetQueryStates = DataGridSetQueryStates;
export interface AuthAuditLogListScreenStats {
	todaySuccessCount: number;
	todayFailureCount: number;
	todayLockedCount: number;
	totalCount: number;
}
export interface AuthAuditLogListScreenProps {
	logs?: AuthAuditLogDto[];
	totalCount: number;
	isLoading: boolean;
	queryStates: AuthAuditLogListScreenQueryStates;
	setQueryStates: AuthAuditLogListScreenSetQueryStates;
	stats?: AuthAuditLogListScreenStats;
}
const authAuditLogTableColumns =
	buildAuthAuditLogTableColumns<AuthAuditLogDto>();
const metricCardColorStyles = {
	success: {
		icon: "text-success",
		value: "text-success",
	},
	danger: {
		icon: "text-danger",
		value: "text-danger",
	},
	warning: {
		icon: "text-warning",
		value: "text-warning",
	},
};
function MetricCard({
	title,
	value,
	description,
	icon,
	color,
	className = "",
}: {
	title: string;
	value: number | string;
	description?: string;
	icon?: ReactNode;
	color: keyof typeof metricCardColorStyles;
	className?: string;
}) {
	const styles = metricCardColorStyles[color];
	return (
		<Card className={`bg-surface ${className}`}>
			<Card.Content className="flex flex-row items-center gap-4 p-4">
				{icon ? (
					<div
						className={`flex size-10 items-center justify-center rounded-lg bg-surface-secondary ${styles.icon}`}
					>
						{icon}
					</div>
				) : null}
				<div className="flex flex-1 flex-col">
					<span className="text-sm text-muted">{title}</span>
					<span className={`text-2xl font-bold ${styles.value}`}>
						{typeof value === "number" ? value.toLocaleString() : value}
					</span>
					{description ? (
						<span className="text-xs text-muted">{description}</span>
					) : null}
				</div>
			</Card.Content>
		</Card>
	);
}

/**
 * 감사 로그 목록 pure screen입니다.
 */
export const AuthAuditLogListScreen = observer(
	({
		logs,
		totalCount,
		isLoading,
		queryStates,
		setQueryStates,
		stats,
	}: AuthAuditLogListScreenProps) => {
		const gridState = useLocalObservable(
			() =>
				new DataGridState({
					queryStates,
					setQueryStates,
				}),
		);
		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const logRows = logs ?? [];
		return (
			<VStack>
				<Screen.Header
					title="로그인 감사 로그"
					description="로그인 시도에 대한 감사 로그를 조회합니다."
				/>
				{stats && (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<MetricCard
							className="h-full border border-success/10 bg-success/5"
							icon={<CheckCircle className="size-5" />}
							title="오늘 성공"
							value={stats.todaySuccessCount ?? 0}
							color="success"
							description="오늘 발생한 성공 로그인 수"
						/>
						<MetricCard
							className="h-full border border-danger/10 bg-danger/5"
							icon={<XCircle className="size-5" />}
							title="오늘 실패"
							value={stats.todayFailureCount ?? 0}
							color="danger"
							description="오늘 발생한 실패 로그인 수"
						/>
						<MetricCard
							className="h-full border border-warning/10 bg-warning/5"
							icon={<Lock className="size-5" />}
							title="오늘 잠금"
							value={stats.todayLockedCount ?? 0}
							color="warning"
							description="오늘 잠금 처리된 계정 수"
						/>
					</div>
				)}
				<SectionSurface className="rounded-2xl border-border/80 bg-surface">
					<Section overflow="hidden">
						<Section.Body>
							<DataGrid
								config={{
									toolbar: {
										leftInputs,
									},
									table: {
										entity: "AuthAuditLog",
										columns: authAuditLogTableColumns,
										emptyMessage: "조회된 감사 로그가 없습니다.",
									},
								}}
								rows={logRows}
								totalCount={totalCount}
								state={gridState}
								isLoading={isLoading}
							/>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);

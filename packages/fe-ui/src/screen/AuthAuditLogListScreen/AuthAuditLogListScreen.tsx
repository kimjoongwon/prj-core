"use client";

import type { AuthAuditLogDto } from "@cocrepo/api/idp/auth";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildAuthAuditLogTableColumns,
	DataGrid,
	DataGridStateModel,
	PageTitleBar,
	Section,
	SectionSurface,
	StatsCard,
	VStack,
} from "@cocrepo/ui";
import { CheckCircle, Lock, XCircle } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

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
				new DataGridStateModel({
					queryStates,
					setQueryStates,
				}),
		);
		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const logRows = logs ?? [];
		return (
			<VStack gap={5}>
				<PageTitleBar
					title="로그인 감사 로그"
					description="로그인 시도에 대한 감사 로그를 조회합니다."
				/>
				{stats && (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<StatsCard
							className="h-full border border-success/10 bg-success/5"
							icon={<CheckCircle className="size-5" />}
							title="오늘 성공"
							value={stats.todaySuccessCount ?? 0}
							color="success"
							description="오늘 발생한 성공 로그인 수"
						/>
						<StatsCard
							className="h-full border border-danger/10 bg-danger/5"
							icon={<XCircle className="size-5" />}
							title="오늘 실패"
							value={stats.todayFailureCount ?? 0}
							color="danger"
							description="오늘 발생한 실패 로그인 수"
						/>
						<StatsCard
							className="h-full border border-warning/10 bg-warning/5"
							icon={<Lock className="size-5" />}
							title="오늘 잠금"
							value={stats.todayLockedCount ?? 0}
							color="warning"
							description="오늘 잠금 처리된 계정 수"
						/>
					</div>
				)}
				<SectionSurface className="rounded-2xl border-border/80 bg-surface/70">
					<Section overflow="hidden" inset="none">
						<Section.Body>
							<DataGrid
								config={{
									entity: "AuthAuditLog",
									columns: authAuditLogTableColumns,
									leftInputs,
									emptyMessage: "조회된 감사 로그가 없습니다.",
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

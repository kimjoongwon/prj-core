"use client";

import type { useMetaDataGridQueryStates } from "@cocrepo/hook";
import type { InputConfig } from "@cocrepo/type";
import {
	buildAuthAuditLogTableColumns,
	MetaDataGrid,
	PageTitleBar,
	StatsCard,
	Surface,
	VStack,
} from "@cocrepo/ui";
import { CheckCircle, Lock, XCircle } from "lucide-react";
import { observer } from "mobx-react-lite";

/** 좌측 입력 정의 */
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "email",
		placeholder: "이메일로 검색...",
		props: {
			debounceMs: 300,
		},
	},
];

export const idpConsoleAuthAuditLogsPageQueryInputs = [...leftInputs];

export type IdpConsoleAuthAuditLogsPageQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[0];
export type IdpConsoleAuthAuditLogsPageSetQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[1];

export interface IdpConsoleAuthAuditLogsPageLog {
	id: string;
	occurredAt?: string | null;
	email: string;
	result: string;
	failureReason?: string | null;
	ipAddress: string;
	userAgent?: string | null;
}

export interface IdpConsoleAuthAuditLogsPageStats {
	todaySuccessCount: number;
	todayFailureCount: number;
	todayLockedCount: number;
	totalCount: number;
}

export interface IdpConsoleAuthAuditLogsPageProps {
	logs: IdpConsoleAuthAuditLogsPageLog[];
	totalCount: number;
	isLoading: boolean;
	queryStates: IdpConsoleAuthAuditLogsPageQueryStates;
	setQueryStates: IdpConsoleAuthAuditLogsPageSetQueryStates;
	stats?: IdpConsoleAuthAuditLogsPageStats;
}

const authAuditLogTableColumns =
	buildAuthAuditLogTableColumns<IdpConsoleAuthAuditLogsPageLog>();

/**
 * 감사 로그 목록 pure page입니다.
 */
export const IdpConsoleAuthAuditLogsPage = observer(({
		logs,
		totalCount,
		isLoading,
		queryStates,
		setQueryStates,
		stats,
	}: IdpConsoleAuthAuditLogsPageProps) => {
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
				<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
					<MetaDataGrid
						config={{
							entity: "AuthAuditLog",
							data: logs,
							totalCount,
							isLoading,
							queryStates,
							setQueryStates,
							columns: authAuditLogTableColumns,
							leftInputs,
							emptyMessage: "조회된 감사 로그가 없습니다.",
						}}
					/>
				</Surface>
			</VStack>
		);
	});

"use client";

import {
	useGetAuthAuditLogStats,
	useGetAuthAuditLogs,
} from "@cocrepo/api/idp/auth";
import type { InputConfig } from "@cocrepo/type";
import {
	authAuditLogTableColumns,
	MetaDataGrid,
	PageTitleBar,
	StatsCard,
	Surface,
	useMetaDataGridQueryStates,
	VStack,
} from "@cocrepo/ui";
import { CheckCircle, Lock, XCircle } from "lucide-react";
import { observer } from "mobx-react-lite";

function AuthAuditLogsPage() {
	return <AuthAuditLogsClient />;
}

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

/**
 * 감사 로그 목록 페이지 - 클라이언트 컴포넌트
 */
function AuthAuditLogsClient() {
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);

	const { data: response, isLoading } = useGetAuthAuditLogs({
		take: queryStates.take,
		skip: queryStates.skip,
		email: queryStates.email || undefined,
	});

	const { data: statsResponse } = useGetAuthAuditLogStats();

	const logs = response?.data ?? [];
	const meta = response?.meta;
	const totalCount = meta?.totalCount ?? 0;

	const stats = statsResponse?.data;

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
}

export const IdpConsoleAuthAuditLogsPage = observer(AuthAuditLogsPage);

export default IdpConsoleAuthAuditLogsPage;

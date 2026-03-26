"use client";

import {
	type AuthAuditLogDto,
	type AuthAuditResult,
	useGetAuthAuditLogStats,
	useGetAuthAuditLogs,
} from "@cocrepo/api/idp/auth";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	AuditResultBadge,
	DateTimeCell,
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

/** 컬럼 정의 */
const columns: MetaDataGridColumnConfig<AuthAuditLogDto>[] = [
	{
		field: "createdAt",
		label: "시간",
		size: 170,
		isRequired: true,
		cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
	},
	{
		field: "email",
		label: "이메일",
		size: 200,
	},
	{
		field: "result",
		label: "결과",
		size: 100,
		align: "center",
		cell: ({ getValue }) => (
			<AuditResultBadge result={getValue() as AuthAuditResult} />
		),
	},
	{
		field: "failureReason",
		label: "실패 사유",
		size: 200,
	},
	{
		field: "ipAddress",
		label: "IP 주소",
		size: 140,
	},
	{
		field: "userAgent",
		label: "User Agent",
		size: 250,
	},
];

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
						columns,
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

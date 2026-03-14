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
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { Card, CardBody } from "@heroui/react";
import { CheckCircle, Lock, XCircle } from "lucide-react";
import { observer } from "mobx-react-lite";

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

/** 통계 카드 컴포넌트 */
function StatCard({
	icon: Icon,
	label,
	value,
	color,
}: {
	icon: React.ElementType;
	label: string;
	value: number;
	color: string;
}) {
	return (
		<Card className="bg-content1">
			<CardBody className="flex flex-row items-center gap-3 p-4">
				<div className={`rounded-lg p-2 ${color}`}>
					<Icon className="h-5 w-5 text-white" />
				</div>
				<div>
					<p className="text-sm text-default-500">{label}</p>
					<p className="text-2xl font-bold">{value}</p>
				</div>
			</CardBody>
		</Card>
	);
}

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
		<section>
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1>{"로그인 감사 로그"}</h1>
					<p>{"로그인 시도에 대한 감사 로그를 조회합니다."}</p>
				</div>
			</div>
			{stats && (
				<div className="grid grid-cols-3 gap-4">
					<StatCard
						icon={CheckCircle}
						label="오늘 성공"
						value={stats.todaySuccessCount ?? 0}
						color="bg-success"
					/>
					<StatCard
						icon={XCircle}
						label="오늘 실패"
						value={stats.todayFailureCount ?? 0}
						color="bg-danger"
					/>
					<StatCard
						icon={Lock}
						label="오늘 잠금"
						value={stats.todayLockedCount ?? 0}
						color="bg-warning"
					/>
				</div>
			)}
			<section>
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
			</section>
		</section>
	);
}

export default observer(AuthAuditLogsClient);

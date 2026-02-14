"use client";

import {
	type AuthAuditLogDto,
	type AuthAuditResult,
	useGetAuthAuditLogs,
} from "@cocrepo/api";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell,
	MetaDataGrid,
	PageSurface,
	SectionSurface,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { Chip } from "@heroui/react";
import { observer } from "mobx-react-lite";

/** 감사 결과 뱃지 */
function AuditResultBadge({ result }: { result: AuthAuditResult }) {
	const config: Record<string, { label: string; color: "success" | "danger" | "warning" }> = {
		SUCCESS: { label: "성공", color: "success" },
		FAILURE: { label: "실패", color: "danger" },
		LOCKED: { label: "잠금", color: "warning" },
	};
	const { label, color } = config[result] ?? { label: result, color: "danger" as const };
	return <Chip size="sm" color={color} variant="flat">{label}</Chip>;
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

	const logs = response?.data ?? [];
	const meta = response?.meta;
	const totalCount = meta?.totalCount ?? 0;

	return (
		<PageSurface
			title="로그인 감사 로그"
			description="로그인 시도에 대한 감사 로그를 조회합니다."
		>
			<SectionSurface>
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
			</SectionSurface>
		</PageSurface>
	);
}

export default observer(AuthAuditLogsClient);

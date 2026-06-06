"use client";

import {
	useGetAuthAuditLogStats,
	useGetAuthAuditLogs,
} from "@cocrepo/api/idp/auth";
import {
	AuthAuditLogListPage,
	type AuthAuditLogListPageStats,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export default observer(function AuthAuditLogsPageRoute() {
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		email: parseAsString.withDefault(""),
	});
	const { data: response, isLoading } = useGetAuthAuditLogs({
		take: queryStates.take,
		skip: queryStates.skip,
		email: queryStates.email || undefined,
	});
	const { data: statsResponse } = useGetAuthAuditLogStats();

	return (
		<AuthAuditLogListPage
			logs={response?.data}
			totalCount={response?.meta?.totalCount ?? 0}
			isLoading={isLoading}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			stats={
				statsResponse?.data ? mapAuditLogStats(statsResponse.data) : undefined
			}
		/>
	);
});

function mapAuditLogStats(stats: {
	todaySuccessCount: number;
	todayFailureCount: number;
	todayLockedCount: number;
	totalCount: number;
}): AuthAuditLogListPageStats {
	return {
		todaySuccessCount: stats.todaySuccessCount,
		todayFailureCount: stats.todayFailureCount,
		todayLockedCount: stats.todayLockedCount,
		totalCount: stats.totalCount,
	};
}

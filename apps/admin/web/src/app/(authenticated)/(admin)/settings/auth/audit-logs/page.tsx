"use client";

import {
	useGetAuthAuditLogStatsSuspense,
	useGetAuthAuditLogsSuspense,
} from "@cocrepo/api/idp/auth";
import {
	AuthAuditLogListScreen,
	type AuthAuditLogListScreenStats,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export default observer(function AuthAuditLogsPageRoute() {
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		email: parseAsString.withDefault(""),
	});
	const { data: response } = useGetAuthAuditLogsSuspense({
		take: queryStates.take,
		skip: queryStates.skip,
		email: queryStates.email || undefined,
	});
	const { data: statsResponse } = useGetAuthAuditLogStatsSuspense();

	return (
		<AuthAuditLogListScreen
			logs={response.data ?? []}
			totalCount={response.meta?.totalCount ?? 0}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			stats={
				statsResponse.data ? mapAuditLogStats(statsResponse.data) : undefined
			}
		/>
	);
});

function mapAuditLogStats(stats: {
	todaySuccessCount: number;
	todayFailureCount: number;
	todayLockedCount: number;
	totalCount: number;
}): AuthAuditLogListScreenStats {
	return {
		todaySuccessCount: stats.todaySuccessCount,
		todayFailureCount: stats.todayFailureCount,
		todayLockedCount: stats.todayLockedCount,
		totalCount: stats.totalCount,
	};
}

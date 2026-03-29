"use client";

import {
	type AuthAuditLogDto,
	useGetAuthAuditLogStats,
	useGetAuthAuditLogs,
} from "@cocrepo/api/idp/auth";
import {
	idpConsoleAuthAuditLogsPageQueryInputs,
	IdpConsoleAuthAuditLogsPage,
	type IdpConsoleAuthAuditLogsPageLog,
	type IdpConsoleAuthAuditLogsPageStats,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

export default observer(function AuthAuditLogsPageRoute() {
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(
		idpConsoleAuthAuditLogsPageQueryInputs,
	);
	const { data: response, isLoading } = useGetAuthAuditLogs({
		take: queryStates.take,
		skip: queryStates.skip,
		email: queryStates.email || undefined,
	});
	const { data: statsResponse } = useGetAuthAuditLogStats();

	return (
		<IdpConsoleAuthAuditLogsPage
			logs={(response?.data ?? []).map(mapAuditLog)}
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

function mapAuditLog(log: AuthAuditLogDto): IdpConsoleAuthAuditLogsPageLog {
	return {
		id: log.id,
		occurredAt: log.createdAt,
		email: log.email,
		result: log.result,
		failureReason: log.failureReason,
		ipAddress: log.ipAddress,
		userAgent: log.userAgent,
	};
}

function mapAuditLogStats(stats: {
	todaySuccessCount: number;
	todayFailureCount: number;
	todayLockedCount: number;
	totalCount: number;
}): IdpConsoleAuthAuditLogsPageStats {
	return {
		todaySuccessCount: stats.todaySuccessCount,
		todayFailureCount: stats.todayFailureCount,
		todayLockedCount: stats.todayLockedCount,
		totalCount: stats.totalCount,
	};
}

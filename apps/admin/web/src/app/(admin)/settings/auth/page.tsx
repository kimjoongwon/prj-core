"use client";

import {
	type DashboardStatsDto,
	type LoginTrendItemDto,
	useGetIdpDashboardStats,
	useGetIdpLoginTrend,
} from "@cocrepo/api/idp/idp-dashboard";
import {
	IdentityDashboardPage,
	type IdentityDashboardPageStats,
	type IdentityDashboardPageTrendItem,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

export default observer(function DashboardPageRoute() {
	const { data: statsResponse } = useGetIdpDashboardStats();
	const { data: trendResponse } = useGetIdpLoginTrend();

	return (
		<IdentityDashboardPage
			stats={
				statsResponse?.data ? mapDashboardStats(statsResponse.data) : undefined
			}
			trendItems={(trendResponse?.data ?? []).map(mapDashboardTrend)}
		/>
	);
});

function mapDashboardStats(
	stats: DashboardStatsDto,
): IdentityDashboardPageStats {
	return {
		activeSessionCount: stats.activeSessionCount,
		todaySuccessCount: stats.todaySuccessCount,
		todayFailureCount: stats.todayFailureCount,
		todayLockedCount: stats.todayLockedCount,
		lockedAccountCount: stats.lockedAccountCount,
		activeClientCount: stats.activeClientCount,
	};
}

function mapDashboardTrend(
	item: LoginTrendItemDto,
): IdentityDashboardPageTrendItem {
	return {
		date: item.date,
		successCount: item.successCount,
		failureCount: item.failureCount,
	};
}

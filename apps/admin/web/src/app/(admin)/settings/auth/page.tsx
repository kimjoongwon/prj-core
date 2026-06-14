"use client";

import {
	type DashboardStatsDto,
	type LoginTrendItemDto,
	useGetIdpDashboardStats,
	useGetIdpLoginTrend,
} from "@cocrepo/api/idp/idp-dashboard";
import {
	IdentityDashboardScreen,
	type IdentityDashboardScreenStats,
	type IdentityDashboardScreenTrendItem,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

export default observer(function DashboardScreenRoute() {
	const { data: statsResponse } = useGetIdpDashboardStats();
	const { data: trendResponse } = useGetIdpLoginTrend();

	return (
		<>
			<IdentityDashboardScreen
				stats={
					statsResponse?.data
						? mapDashboardStats(statsResponse.data)
						: undefined
				}
				trendItems={(trendResponse?.data ?? []).map(mapDashboardTrend)}
			/>
		</>
	);
});

function mapDashboardStats(
	stats: DashboardStatsDto,
): IdentityDashboardScreenStats {
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
): IdentityDashboardScreenTrendItem {
	return {
		date: item.date,
		successCount: item.successCount,
		failureCount: item.failureCount,
	};
}

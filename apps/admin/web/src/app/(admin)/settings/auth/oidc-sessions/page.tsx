"use client";

import {
	getGetOidcSessionStatsQueryKey,
	getGetOidcSessionsQueryKey,
	useGetOidcSessionStats,
	useGetOidcSessions,
	useRevokeAllOidcSessions,
	useRevokeOidcSession,
	useRevokeOidcSessionsByGrant,
} from "@cocrepo/api/core/oidc-sessions";
import {
	OidcSessionListScreen,
	type OidcSessionListScreenStats,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export default observer(function OidcSessionsPageRoute() {
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		modelType: parseAsString.withDefault(""),
		accountId: parseAsString.withDefault(""),
	});
	const queryParams = {
		take: queryStates.take,
		skip: queryStates.skip,
		modelType: queryStates.modelType || undefined,
		accountId: queryStates.accountId || undefined,
	};
	const { data: response, isLoading } = useGetOidcSessions(queryParams);
	const { data: statsResponse } = useGetOidcSessionStats();

	const invalidateSessionQueries = () => {
		queryClient.invalidateQueries({
			queryKey: getGetOidcSessionsQueryKey(),
		});
		queryClient.invalidateQueries({
			queryKey: getGetOidcSessionStatsQueryKey(),
		});
	};

	const { mutateAsync: revokeSession } = useRevokeOidcSession({
		mutation: {
			onSuccess: () => {
				invalidateSessionQueries();
				toast.success("세션 폐기", {
					description: "선택한 세션/토큰을 폐기했습니다.",
				});
			},
			onError: (error) => {
				toast.danger("세션 폐기 실패", {
					description:
						error.message || "세션/토큰 폐기 중 오류가 발생했습니다.",
				});
			},
		},
	});
	const { mutateAsync: revokeByGrant } = useRevokeOidcSessionsByGrant({
		mutation: {
			onSuccess: () => {
				invalidateSessionQueries();
				toast.success("Grant 세션 폐기", {
					description: "선택한 Grant의 세션/토큰을 폐기했습니다.",
				});
			},
			onError: (error) => {
				toast.danger("Grant 세션 폐기 실패", {
					description:
						error.message || "Grant 세션/토큰 폐기 중 오류가 발생했습니다.",
				});
			},
		},
	});
	const { mutateAsync: revokeAll, isPending: isRevokingAll } =
		useRevokeAllOidcSessions({
			mutation: {
				onSuccess: () => {
					invalidateSessionQueries();
					toast.success("전체 세션 폐기", {
						description: "전체 OIDC 세션/토큰을 폐기했습니다.",
					});
				},
				onError: (error) => {
					toast.danger("전체 세션 폐기 실패", {
						description:
							error.message ||
							"전체 OIDC 세션/토큰 폐기 중 오류가 발생했습니다.",
					});
				},
			},
		});

	return (
		<OidcSessionListScreen
			sessions={response?.data}
			totalCount={response?.meta?.totalCount ?? 0}
			isLoading={isLoading}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			stats={
				statsResponse?.data
					? mapOidcSessionStats(statsResponse.data)
					: undefined
			}
			isRevokingAll={isRevokingAll}
			onRevokeSession={(key) => {
				void revokeSession({ key });
			}}
			onClickRevokeByGrantButton={(grantId) => {
				void revokeByGrant({ grantId });
			}}
			onClickRevokeAllButton={() => {
				void revokeAll();
			}}
		/>
	);
});

function mapOidcSessionStats(stats: {
	totalCount: number;
	byModelType: Record<string, number>;
}): OidcSessionListScreenStats {
	return {
		totalCount: stats.totalCount,
		byModelType: stats.byModelType ?? {},
	};
}

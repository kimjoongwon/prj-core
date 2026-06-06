"use client";

import {
	getGetOidcSessionStatsQueryKey,
	getGetOidcSessionsQueryKey,
	useGetOidcSessionStats,
	useGetOidcSessions,
	useRevokeAllOidcSessions,
	useRevokeOidcSession,
	useRevokeOidcSessionsByGrant,
} from "@cocrepo/api/idp/oidc-sessions";
import {
	OidcSessionListPage,
	type OidcSessionListPageStats,
} from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";

export default observer(function OidcSessionsPageRoute() {
	const queryClient = useQueryClient();
	const [revokeGrantId, setRevokeGrantId] = useState<string | null>(null);
	const [isGrantRevokeModalOpen, setIsGrantRevokeModalOpen] = useState(false);
	const [isRevokeAllModalOpen, setIsRevokeAllModalOpen] = useState(false);
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

	const { mutate: revokeSession } = useRevokeOidcSession({
		mutation: {
			onSuccess: invalidateSessionQueries,
		},
	});
	const { mutate: revokeByGrant, isPending: isRevokingByGrant } =
		useRevokeOidcSessionsByGrant({
			mutation: {
				onSuccess: invalidateSessionQueries,
			},
		});
	const { mutate: revokeAll, isPending: isRevokingAll } =
		useRevokeAllOidcSessions({
			mutation: {
				onSuccess: invalidateSessionQueries,
			},
		});

	return (
		<OidcSessionListPage
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
			revokeGrantId={revokeGrantId}
			isGrantRevokeModalOpen={isGrantRevokeModalOpen}
			isRevokeAllModalOpen={isRevokeAllModalOpen}
			isRevokingByGrant={isRevokingByGrant}
			isRevokingAll={isRevokingAll}
			onRevokeSession={(key) => {
				revokeSession({ key });
			}}
			onOpenGrantRevokeModal={(grantId) => {
				setRevokeGrantId(grantId);
				setIsGrantRevokeModalOpen(true);
			}}
			onCloseGrantRevokeModal={() => {
				setIsGrantRevokeModalOpen(false);
				setRevokeGrantId(null);
			}}
			onConfirmRevokeByGrant={(grantId) => {
				revokeByGrant({ grantId });
				setIsGrantRevokeModalOpen(false);
				setRevokeGrantId(null);
			}}
			onOpenRevokeAllModal={() => {
				setIsRevokeAllModalOpen(true);
			}}
			onCloseRevokeAllModal={() => {
				setIsRevokeAllModalOpen(false);
			}}
			onConfirmRevokeAll={() => {
				revokeAll();
				setIsRevokeAllModalOpen(false);
			}}
		/>
	);
});

function mapOidcSessionStats(stats: {
	totalCount: number;
	byModelType: Record<string, number>;
}): OidcSessionListPageStats {
	return {
		totalCount: stats.totalCount,
		byModelType: stats.byModelType ?? {},
	};
}

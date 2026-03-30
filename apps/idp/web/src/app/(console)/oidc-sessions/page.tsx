"use client";

import {
	getGetOidcSessionStatsQueryKey,
	getGetOidcSessionsQueryKey,
	type OidcSessionDto,
	useGetOidcSessionStats,
	useGetOidcSessions,
	useRevokeAllOidcSessions,
	useRevokeOidcSession,
	useRevokeOidcSessionsByGrant,
} from "@cocrepo/api/idp/oidc-sessions";
import {
	idpConsoleOidcSessionsPageQueryInputs,
	IdpConsoleOidcSessionsPage,
	type IdpConsoleOidcSessionsPageSession,
	type IdpConsoleOidcSessionsPageStats,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useState } from "react";

export default observer(function OidcSessionsPageRoute() {
	const queryClient = useQueryClient();
	const [revokeGrantId, setRevokeGrantId] = useState<string | null>(null);
	const [isGrantRevokeModalOpen, setIsGrantRevokeModalOpen] = useState(false);
	const [isRevokeAllModalOpen, setIsRevokeAllModalOpen] = useState(false);
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(
		idpConsoleOidcSessionsPageQueryInputs,
	);
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
		<IdpConsoleOidcSessionsPage
			sessions={(response?.data ?? []).map(mapOidcSession)}
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

function mapOidcSession(
	session: OidcSessionDto,
): IdpConsoleOidcSessionsPageSession {
	return {
		id: session.id,
		key: session.key,
		modelType: session.modelType,
		accountId: session.accountId,
		grantId: session.grantId,
		expiresAt: session.expiresAt,
		createdAt: session.createdAt,
	};
}

function mapOidcSessionStats(stats: {
	totalCount: number;
	byModelType: Record<string, number>;
}): IdpConsoleOidcSessionsPageStats {
	return {
		totalCount: stats.totalCount,
		byModelType: stats.byModelType ?? {},
	};
}

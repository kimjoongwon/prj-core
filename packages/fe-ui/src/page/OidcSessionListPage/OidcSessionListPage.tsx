"use client";

import { MODEL_TYPE_OPTIONS } from "@cocrepo/constant";
import type {
	InputConfig,
	MetaDataGridQueryStates,
	MetaDataGridSetQueryStates,
} from "@cocrepo/type";
import {
	buildOidcSessionTableColumns,
	ConfirmModal,
	MetaDataGrid,
	MetaDataGridStateModel,
	PageTitleBar,
	StatsCard,
	Surface,
	VStack,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Activity, Trash2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

/**
 * 좌측 입력 정의 (모델 타입 필터 + accountId 검색)
 */
const leftInputs: InputConfig[] = [
	{
		type: "select",
		id: "modelType",
		placeholder: "모델 타입",
		props: {
			options: MODEL_TYPE_OPTIONS as unknown as Array<{
				value: string;
				label: string;
			}>,
		},
	},
	{
		type: "search",
		id: "accountId",
		placeholder: "Account ID 검색...",
	},
];

export const idpConsoleOidcSessionsPageQueryInputs = [...leftInputs];

export interface OidcSessionListPageQueryStates
	extends MetaDataGridQueryStates {
	take: number;
	skip: number;
	modelType: string;
	accountId: string;
}
export type OidcSessionListPageSetQueryStates = MetaDataGridSetQueryStates;

export interface OidcSessionListPageSession {
	id: string;
	key: string;
	modelType: string;
	accountId?: string;
	grantId?: string;
	expiresAt: string | null;
	createdAt: string;
}

export interface OidcSessionListPageStats {
	totalCount: number;
	byModelType: Record<string, number>;
}

export interface OidcSessionListPageProps {
	sessions: OidcSessionListPageSession[];
	totalCount: number;
	isLoading: boolean;
	queryStates: OidcSessionListPageQueryStates;
	setQueryStates: OidcSessionListPageSetQueryStates;
	stats?: OidcSessionListPageStats;
	revokeGrantId: string | null;
	isGrantRevokeModalOpen: boolean;
	isRevokeAllModalOpen: boolean;
	isRevokingByGrant: boolean;
	isRevokingAll: boolean;
	onRevokeSession: (key: string) => void;
	onOpenGrantRevokeModal: (grantId: string) => void;
	onCloseGrantRevokeModal: () => void;
	onConfirmRevokeByGrant: (grantId: string) => void;
	onOpenRevokeAllModal: () => void;
	onCloseRevokeAllModal: () => void;
	onConfirmRevokeAll: () => void;
}

/**
 * OIDC 세션 목록 pure page입니다.
 */
export const OidcSessionListPage = observer(({
		sessions,
		totalCount,
		isLoading,
		queryStates,
		setQueryStates,
		stats,
		revokeGrantId,
		isGrantRevokeModalOpen,
		isRevokeAllModalOpen,
		isRevokingByGrant,
		isRevokingAll,
		onRevokeSession,
		onOpenGrantRevokeModal,
		onCloseGrantRevokeModal,
		onConfirmRevokeByGrant,
		onOpenRevokeAllModal,
		onCloseRevokeAllModal,
		onConfirmRevokeAll,
	}: OidcSessionListPageProps) => {
	const gridState = useLocalObservable(
		() => new MetaDataGridStateModel({ queryStates, setQueryStates }),
	);

	useEffect(() => {
		gridState.syncQuery(queryStates, setQueryStates);
	}, [gridState, queryStates, setQueryStates]);
		const byModelType = (stats?.byModelType ?? {}) as Record<string, number>;

		const onClickRevokeSession = (key: string) => {
			onRevokeSession(key);
		};

		const onClickGrantId = (grantId: string) => {
			onOpenGrantRevokeModal(grantId);
		};

		const columns =
			buildOidcSessionTableColumns<OidcSessionListPageSession>({
				onClickGrantId,
				onClickRevokeSession,
			});

		return (
			<VStack gap={5}>
				<PageTitleBar
					title="OIDC 세션/토큰"
					description="OIDC 세션 및 토큰을 조회하고 관리합니다."
					actions={
						<Button
							color="danger"
							variant="flat"
							startContent={<Trash2 className="h-4 w-4" />}
							onPress={onOpenRevokeAllModal}
							isDisabled={totalCount === 0}
						>
							전체 폐기
						</Button>
					}
				/>
				{stats && (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
						<StatsCard
							className="h-full border border-primary/10 bg-primary/5"
							icon={<Activity className="size-5" />}
							title="전체"
							value={stats.totalCount ?? 0}
							color="primary"
							description="현재 저장된 세션/토큰 수"
						/>
						{Object.entries(byModelType).map(([type, count]) => (
							<StatsCard
								key={type}
								className="h-full border border-default-200 bg-content1/80"
								title={type}
								value={count}
								description="모델 타입별 활성 건수"
							/>
						))}
					</div>
				)}
				<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
					<MetaDataGrid
						config={{
							entity: "OidcSession",
							columns,
							leftInputs,
							emptyMessage: "등록된 OIDC 세션/토큰이 없습니다.",
						}}
	rows={sessions}
	totalCount={totalCount}
	isLoading={isLoading}
	state={gridState}
/>
				</Surface>
				<ConfirmModal
					isOpen={isGrantRevokeModalOpen}
					onClose={onCloseGrantRevokeModal}
					onConfirm={() => {
						if (revokeGrantId) {
							onConfirmRevokeByGrant(revokeGrantId);
						}
					}}
					title="Grant 일괄 폐기"
					message={
						<>
							<p>
								이 Grant에 연결된 모든 세션 및 토큰을 일괄 폐기하시겠습니까?
							</p>
							{revokeGrantId && (
								<p className="mt-2 rounded-lg bg-default-100 p-2 font-mono text-sm">
									Grant ID: {revokeGrantId}
								</p>
							)}
						</>
					}
					confirmText="일괄 폐기"
					confirmColor="danger"
					iconType="warning"
					loading={isRevokingByGrant}
				/>
				<ConfirmModal
					isOpen={isRevokeAllModalOpen}
					onClose={onCloseRevokeAllModal}
					onConfirm={onConfirmRevokeAll}
					title="전체 세션/토큰 폐기"
					message={
						<p>
							모든 OIDC 세션 및 토큰({stats?.totalCount ?? 0}건)을 일괄
							폐기하시겠습니까? 이 작업은 되돌릴 수 없습니다.
						</p>
					}
					confirmText="전체 폐기"
					confirmColor="danger"
					iconType="warning"
					loading={isRevokingAll}
				/>
			</VStack>
		);
	});

"use client";

import {
	useGetOidcSessionStats,
	useGetOidcSessions,
	useRevokeAllOidcSessions,
	useRevokeOidcSession,
	useRevokeOidcSessionsByGrant,
} from "@cocrepo/api/idp/oidc-sessions";
import { MODEL_TYPE_OPTIONS } from "@cocrepo/constant";
import type { InputConfig } from "@cocrepo/type";
import {
	buildOidcSessionTableColumns,
	ConfirmModal,
	MetaDataGrid,
	PageTitleBar,
	StatsCard,
	Surface,
	useMetaDataGridQueryStates,
	VStack,
} from "@cocrepo/ui";
import { Button, useDisclosure } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, Trash2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";

function OidcSessionsPage() {
	return <OidcSessionsPageClient />;
}

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
		props: {
			debounceMs: 300,
		},
	},
];

/**
 * OIDC 세션 목록 페이지 - 클라이언트 컴포넌트
 */
function OidcSessionsPageClient() {
	const queryClient = useQueryClient();
	const revokeModal = useDisclosure();
	const revokeAllModal = useDisclosure();

	const state = useLocalObservable(() => ({
		grantIdToRevoke: null as string | null,
	}));

	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);

	const { data: response, isLoading } = useGetOidcSessions({
		take: queryStates.take,
		skip: queryStates.skip,
		modelType: queryStates.modelType || undefined,
		accountId: queryStates.accountId || undefined,
	});

	const { data: statsResponse } = useGetOidcSessionStats();

	const { mutate: revokeSession } = useRevokeOidcSession({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: ["getOidcSessions"],
				});
				queryClient.invalidateQueries({
					queryKey: ["getOidcSessionStats"],
				});
			},
		},
	});

	const { mutate: revokeByGrant, isPending: isRevokingByGrant } =
		useRevokeOidcSessionsByGrant({
			mutation: {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: ["getOidcSessions"],
					});
					queryClient.invalidateQueries({
						queryKey: ["getOidcSessionStats"],
					});
					revokeModal.onClose();
				},
			},
		});

	const { mutate: revokeAll, isPending: isRevokingAll } =
		useRevokeAllOidcSessions({
			mutation: {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: ["getOidcSessions"],
					});
					queryClient.invalidateQueries({
						queryKey: ["getOidcSessionStats"],
					});
					revokeAllModal.onClose();
				},
			},
		});

	const sessions = response?.data ?? [];
	const meta = response?.meta;
	const totalCount = meta?.totalCount ?? 0;

	const stats = statsResponse?.data;
	const byModelType = (stats?.byModelType ?? {}) as Record<string, number>;

	const onClickRevokeSession = (key: string) => {
		revokeSession({ key });
	};

	const onClickGrantId = (grantId: string) => {
		state.grantIdToRevoke = grantId;
		revokeModal.onOpen();
	};

	const onClickConfirmRevokeByGrant = () => {
		if (state.grantIdToRevoke) {
			revokeByGrant({ grantId: state.grantIdToRevoke });
		}
	};

	const onClickConfirmRevokeAll = () => {
		revokeAll();
	};

	const columns = buildOidcSessionTableColumns({
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
						onPress={revokeAllModal.onOpen}
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
						data: sessions,
						totalCount,
						isLoading,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						emptyMessage: "등록된 OIDC 세션/토큰이 없습니다.",
					}}
				/>
			</Surface>
			<ConfirmModal
				isOpen={revokeModal.isOpen}
				onClose={revokeModal.onClose}
				onConfirm={onClickConfirmRevokeByGrant}
				title="Grant 일괄 폐기"
				message={
					<>
						<p>이 Grant에 연결된 모든 세션 및 토큰을 일괄 폐기하시겠습니까?</p>
						{state.grantIdToRevoke && (
							<p className="mt-2 rounded-lg bg-default-100 p-2 font-mono text-sm">
								Grant ID: {state.grantIdToRevoke}
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
				isOpen={revokeAllModal.isOpen}
				onClose={revokeAllModal.onClose}
				onConfirm={onClickConfirmRevokeAll}
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
}

export const IdpConsoleOidcSessionsPage = observer(OidcSessionsPage);

export default IdpConsoleOidcSessionsPage;

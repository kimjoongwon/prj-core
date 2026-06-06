"use client";

import type { IdpAccountDto } from "@cocrepo/api/idp/idp-accounts";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildIdpAccountTableColumns,
	ConfirmModal,
	DataGrid,
	DataGridStateModel,
	PageTitleBar,
	Surface,
	VStack,
} from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useOverlayState } from "@heroui/react";

/**
 * 좌측 입력 정의 (검색)
 */
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이메일 또는 이름으로 검색...",
	},
];

export const idpConsoleAccountsPageQueryInputs = [...leftInputs];

export interface AccountListPageQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
}
export type AccountListPageSetQueryStates = DataGridSetQueryStates;

export interface AccountListPageProps {
	accounts?: IdpAccountDto[];
	totalCount: number;
	isLoading: boolean;
	isUnlocking: boolean;
	queryStates: AccountListPageQueryStates;
	setQueryStates: AccountListPageSetQueryStates;
	onConfirmUnlockAccount: (userId: string) => void;
}

/**
 * IDP 계정 관리 목록 pure screen입니다.
 */
export const AccountListPage = observer(
	({
		accounts,
		totalCount,
		isLoading,
		isUnlocking,
		queryStates,
		setQueryStates,
		onConfirmUnlockAccount,
	}: AccountListPageProps) => {
		const gridState = useLocalObservable(
			() => new DataGridStateModel({ queryStates, setQueryStates }),
		);

		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const unlockModal = useOverlayState();
		const [accountToUnlock, setAccountToUnlock] =
			useState<IdpAccountDto | null>(null);
		const accountRows = accounts ?? [];

		const onClickOpenUnlockModal = (account: IdpAccountDto) => {
			setAccountToUnlock(account);
			unlockModal.open();
		};

		const onCloseUnlockModal = () => {
			setAccountToUnlock(null);
			unlockModal.close();
		};

		const onClickConfirmUnlock = () => {
			if (!accountToUnlock) {
				return;
			}

			onConfirmUnlockAccount(accountToUnlock.id);
			onCloseUnlockModal();
		};

		const columns = buildIdpAccountTableColumns<IdpAccountDto>({
			onClickOpenUnlockModal,
		});

		return (
			<VStack gap={5}>
				<PageTitleBar
					title="계정 관리"
					description="IDP 계정의 보안 상태를 관리합니다."
				/>
				<Surface className="overflow-hidden rounded-2xl border-border/80 bg-surface/70">
					<DataGrid
						config={{
							entity: "IdpAccount",
							columns,
							leftInputs,
							emptyMessage: "등록된 계정이 없습니다.",
						}}
							rows={accountRows}
							totalCount={totalCount}
							state={gridState}
							isLoading={isLoading}
						/>
				</Surface>
				<ConfirmModal
					isOpen={unlockModal.isOpen}
					onClose={onCloseUnlockModal}
					onConfirm={onClickConfirmUnlock}
					title="잠금 해제"
					message={
						<>
							<p>
								<strong>
									{accountToUnlock?.name ?? accountToUnlock?.email}
								</strong>
								&nbsp;계정의 잠금을 해제하시겠습니까?
							</p>
							<p className="mt-2 text-sm text-muted">
								연속 로그인 실패로 누적된 잠금 상태와 실패 횟수가 함께
								초기화됩니다.
							</p>
						</>
					}
					confirmText="잠금 해제"
					confirmColor="primary"
					iconType="warning"
					loading={isUnlocking}
				/>
			</VStack>
		);
	},
);

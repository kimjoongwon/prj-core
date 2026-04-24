"use client";

import type {
	InputConfig,
	MetaDataGridQueryStates,
	MetaDataGridSetQueryStates,
} from "@cocrepo/type";
import {
	buildIdpAccountTableColumns,
	ConfirmModal,
	MetaDataGrid,
	PageTitleBar,
	Surface,
	VStack,
} from "@cocrepo/ui";
import { useDisclosure } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

/**
 * 좌측 입력 정의 (검색)
 */
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이메일 또는 이름으로 검색...",
		props: {
			debounceMs: 300,
		},
	},
];

export const idpConsoleAccountsPageQueryInputs = [...leftInputs];

export interface AccountListPageQueryStates extends MetaDataGridQueryStates {
	take: number;
	skip: number;
	search: string;
}
export type AccountListPageSetQueryStates = MetaDataGridSetQueryStates;

export interface AccountListPageAccount {
	id: string;
	name: string;
	email: string;
	isActive: boolean;
	isPermanentlyLocked: boolean;
	lockedUntil?: string | null;
	failedLoginAttempts: number;
	lastLoginAt?: string | null;
}

export interface AccountListPageProps {
	accounts: AccountListPageAccount[];
	totalCount: number;
	isLoading: boolean;
	isUnlocking: boolean;
	queryStates: AccountListPageQueryStates;
	setQueryStates: AccountListPageSetQueryStates;
	onConfirmUnlockAccount: (userId: string) => void;
}

/**
 * IDP 계정 관리 목록 pure page입니다.
 */
export const AccountListPage = observer(({
	accounts,
	totalCount,
	isLoading,
	isUnlocking,
	queryStates,
	setQueryStates,
	onConfirmUnlockAccount,
}: AccountListPageProps) => {
	const unlockModal = useDisclosure();
	const [accountToUnlock, setAccountToUnlock] =
		useState<AccountListPageAccount | null>(null);

	const onClickOpenUnlockModal = (account: AccountListPageAccount) => {
		setAccountToUnlock(account);
		unlockModal.onOpen();
	};

	const onCloseUnlockModal = () => {
		setAccountToUnlock(null);
		unlockModal.onClose();
	};

	const onClickConfirmUnlock = () => {
		if (!accountToUnlock) {
			return;
		}

		onConfirmUnlockAccount(accountToUnlock.id);
		onCloseUnlockModal();
	};

	const columns = buildIdpAccountTableColumns<AccountListPageAccount>({
		onClickOpenUnlockModal,
	});

	return (
		<VStack gap={5}>
			<PageTitleBar
				title="계정 관리"
				description="IDP 계정의 보안 상태를 관리합니다."
			/>
			<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
				<MetaDataGrid
					config={{
						entity: "IdpAccount",
						data: accounts,
						totalCount,
						isLoading,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						emptyMessage: "등록된 계정이 없습니다.",
					}}
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
							<strong>{accountToUnlock?.name ?? accountToUnlock?.email}</strong>
							&nbsp;계정의 잠금을 해제하시겠습니까?
						</p>
						<p className="mt-2 text-sm text-default-400">
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
});

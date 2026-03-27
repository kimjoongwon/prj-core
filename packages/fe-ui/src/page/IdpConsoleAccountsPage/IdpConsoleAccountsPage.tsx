"use client";

import {
	getGetIdpAccountQueryKey,
	getGetIdpAccountsQueryKey,
	type IdpAccountDto,
	useGetIdpAccounts,
} from "@cocrepo/api/idp/idp-accounts";
import { useUnlockAccount } from "@cocrepo/api/idp/auth";
import type { InputConfig } from "@cocrepo/type";
import {
	buildIdpAccountTableColumns,
	ConfirmModal,
	MetaDataGrid,
	PageTitleBar,
	Surface,
	useMetaDataGridQueryStates,
	VStack,
} from "@cocrepo/ui";
import { useDisclosure } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useState } from "react";

function AccountsPage() {
	return <AccountsPageClient />;
}

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

/**
 * IDP 계정 관리 목록 페이지 - 클라이언트 컴포넌트
 */
function AccountsPageClient() {
	const queryClient = useQueryClient();
	const unlockModal = useDisclosure();
	const [accountToUnlock, setAccountToUnlock] = useState<IdpAccountDto | null>(
		null,
	);
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);
	const queryParams = {
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
	};

	const { data: response, isLoading } = useGetIdpAccounts(queryParams);
	const { mutate: unlockAccount, isPending: isUnlocking } = useUnlockAccount({
		mutation: {
			onSuccess: (_data, variables) => {
				unlockModal.onClose();
				setAccountToUnlock(null);
				queryClient.invalidateQueries({
					queryKey: getGetIdpAccountsQueryKey(),
				});
				queryClient.invalidateQueries({
					queryKey: getGetIdpAccountQueryKey(variables.userId),
				});
			},
		},
	});

	const accounts = response?.data ?? [];
	const meta = response?.meta;
	const totalCount = meta?.totalCount ?? 0;

	const onClickOpenUnlockModal = (account: IdpAccountDto) => {
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

		unlockAccount({ userId: accountToUnlock.id });
	};

	const columns = buildIdpAccountTableColumns({
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
}

export const IdpConsoleAccountsPage = observer(AccountsPage);

export default IdpConsoleAccountsPage;

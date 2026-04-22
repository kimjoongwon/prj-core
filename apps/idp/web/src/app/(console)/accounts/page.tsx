"use client";

import { useUnlockAccount } from "@cocrepo/api/idp/auth";
import {
	getGetIdpAccountQueryKey,
	getGetIdpAccountsQueryKey,
	type IdpAccountDto,
	useGetIdpAccounts,
} from "@cocrepo/api/idp/idp-accounts";
import {
	idpConsoleAccountsPageQueryInputs,
	AccountListPage,
	type AccountListPageAccount,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";

export default observer(function AccountsPageRoute() {
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(
		idpConsoleAccountsPageQueryInputs,
	);
	const queryParams = {
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
	};
	const { data: response, isLoading } = useGetIdpAccounts(queryParams);
	const { mutate: unlockAccount, isPending: isUnlocking } = useUnlockAccount({
		mutation: {
			onSuccess: (_data, variables) => {
				queryClient.invalidateQueries({
					queryKey: getGetIdpAccountsQueryKey(),
				});
				queryClient.invalidateQueries({
					queryKey: getGetIdpAccountQueryKey(variables.userId),
				});
			},
		},
	});

	return (
		<AccountListPage
			accounts={(response?.data ?? []).map(mapAccountListItem)}
			totalCount={response?.meta?.totalCount ?? 0}
			isLoading={isLoading}
			isUnlocking={isUnlocking}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onConfirmUnlockAccount={(userId) => {
				unlockAccount({ userId });
			}}
		/>
	);
});

function mapAccountListItem(
	account: IdpAccountDto,
): AccountListPageAccount {
	return {
		id: account.id,
		name: account.name,
		email: account.email,
		isActive: account.isActive,
		isPermanentlyLocked: account.isPermanentlyLocked,
		lockedUntil: account.lockedUntil,
		failedLoginAttempts: account.failedLoginAttempts,
		lastLoginAt: account.lastLoginAt,
	};
}

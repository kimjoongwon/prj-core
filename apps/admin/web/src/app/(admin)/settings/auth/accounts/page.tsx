"use client";

import { useUnlockAccount } from "@cocrepo/api/idp/auth";
import {
	getGetIdpAccountQueryKey,
	getGetIdpAccountsQueryKey,
	useGetIdpAccounts,
} from "@cocrepo/api/idp/idp-accounts";
import { AccountListScreen } from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export default observer(function AccountsPageRoute() {
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		search: parseAsString.withDefault(""),
	});
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
		<>
			<AccountListScreen
				accounts={response?.data}
				totalCount={response?.meta?.totalCount ?? 0}
				isLoading={isLoading}
				isUnlocking={isUnlocking}
				queryStates={queryStates}
				setQueryStates={setQueryStates}
				onConfirmUnlockAccount={(userId) => {
					unlockAccount({ userId });
				}}
			/>
		</>
	);
});

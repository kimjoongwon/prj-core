"use client";

import { useUnlockAccount } from "@cocrepo/api/idp/auth";
import {
	getGetIdpAccountQueryKey,
	getGetIdpAccountsQueryKey,
	useGetIdpAccounts,
} from "@cocrepo/api/idp/idp-accounts";
import { AccountListScreen } from "@cocrepo/ui";
import { toast } from "@heroui/react";
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
	const { mutateAsync: unlockAccount } = useUnlockAccount({
		mutation: {
			onSuccess: (_data, variables) => {
				queryClient.invalidateQueries({
					queryKey: getGetIdpAccountsQueryKey(),
				});
				queryClient.invalidateQueries({
					queryKey: getGetIdpAccountQueryKey(variables.userId),
				});
				toast.success("계정 잠금 해제", {
					description: "계정 잠금을 해제했습니다.",
				});
			},
			onError: (error) => {
				toast.danger("계정 잠금 해제 실패", {
					description:
						error.message || "계정 잠금 해제 중 오류가 발생했습니다.",
				});
			},
		},
	});

	return (
		<AccountListScreen
			accounts={response?.data}
			totalCount={response?.meta?.totalCount ?? 0}
			isLoading={isLoading}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onClickUnlockAccountButton={(userId) => {
				void unlockAccount({ userId });
			}}
		/>
	);
});

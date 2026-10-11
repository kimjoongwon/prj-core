import { useGetUsersSuspense } from "@cocrepo/api/core/users";
import { DataGridState, UserListScreenProps } from "@cocrepo/ui";
import { useLocalObservable } from "mobx-react-lite";
import { parseAsInteger, useQueryStates } from "nuqs";

export const usePage = () => {
	const [{ skip, take }, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
	});

	const { data: getUsersSuspenseData } = useGetUsersSuspense({
		skip,
		take,
	});

	const state = useLocalObservable<UserListScreenProps["state"]>(() => ({
		dataGrid: new DataGridState({
			queryStates: { take, skip },
			setQueryStates,
			rows: getUsersSuspenseData?.data ?? [],
		}),
	}));

	return {
		state,
		users: getUsersSuspenseData?.data,
		totalCount: getUsersSuspenseData?.meta?.total,
	};
};

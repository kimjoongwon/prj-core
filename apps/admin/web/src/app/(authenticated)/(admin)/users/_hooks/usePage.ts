import type { UserDto } from "@cocrepo/api/core/users";
import { useGetUsersSuspense } from "@cocrepo/api/core/users";
import {
	buildUserListTableColumns,
	createDataGridState,
	UserListScreenProps,
} from "@cocrepo/ui";
import { parseAsInteger, useQueryStates } from "nuqs";
import { useMemo } from "react";

export const usePage = () => {
	const [{ skip, take }, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
	});

	const { data: getUsersSuspenseData } = useGetUsersSuspense({
		skip,
		take,
	});

	const state = useMemo<UserListScreenProps["state"]>(
		() => ({
			dataGrid: createDataGridState<UserDto>({
				query: { take, skip },
				setQueryStates: (values) =>
					setQueryStates({
						take: typeof values.take === "number" ? values.take : undefined,
						skip: typeof values.skip === "number" ? values.skip : undefined,
					}),
				pagination: { totalCount: getUsersSuspenseData.meta?.total ?? 0 },
				table: {
					rows: getUsersSuspenseData.data ?? [],
					columns: buildUserListTableColumns<UserDto>(),
				},
			}),
		}),
		[skip, take, setQueryStates, getUsersSuspenseData],
	);

	return {
		state,
		users: getUsersSuspenseData.data,
		totalCount: getUsersSuspenseData.meta?.total,
	};
};

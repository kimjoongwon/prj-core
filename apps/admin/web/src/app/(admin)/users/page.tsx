"use client";

import { useGetUsers } from "@cocrepo/api/core/users";
import { useDebouncedCallback } from "@cocrepo/hook";
import { UserListScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import {
	parseAsInteger,
	parseAsString,
	useQueryState,
	useQueryStates,
} from "nuqs";
import { Suspense, useEffect, useState } from "react";

interface UsersQueryStates {
	take: number;
	skip: number;
}

function getUsersParams(queryStates: UsersQueryStates, search: string) {
	return {
		take: queryStates.take,
		skip: queryStates.skip,
		name: search || undefined,
	};
}

function UsersPageContent() {
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
	});
	const [searchQuery, setSearchQuery] = useQueryState(
		"search",
		parseAsString.withDefault(""),
	);
	const [searchValue, setSearchValue] = useState(searchQuery);
	const usersParams = getUsersParams(queryStates, searchQuery);

	useEffect(() => {
		setSearchValue(searchQuery);
	}, [searchQuery]);

	const debouncedSetQuery = useDebouncedCallback((nextValue: string) => {
		void setSearchQuery(nextValue || null);
	}, 300);

	const { data: response, isLoading } = useGetUsers(usersParams);

	return (
		<UserListScreen
			users={response?.data}
			totalCount={response?.meta?.total ?? 0}
			stats={
				response?.stats
					? {
							total: response.stats.total ?? 0,
							active: response.stats.active ?? 0,
							inactive: response.stats.inactive ?? 0,
						}
					: undefined
			}
			isLoading={isLoading}
			searchValue={searchValue}
			onChangeSearchValue={(value) => {
				setSearchValue(value);
				debouncedSetQuery(value);
			}}
			onClearSearch={() => {
				setSearchValue("");
				void setSearchQuery(null);
			}}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
		/>
	);
}

function UsersPageFallback() {
	return null;
}

export default observer(function UsersPageRoute() {
	return (
		<Suspense fallback={<UsersPageFallback />}>
			<UsersPageContent />
		</Suspense>
	);
});

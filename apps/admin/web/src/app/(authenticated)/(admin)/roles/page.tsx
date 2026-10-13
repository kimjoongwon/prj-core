"use client";

import { useGetRolesSuspense } from "@cocrepo/api/core/roles";
import { RoleListScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryStates } from "nuqs";

export default observer(function RolesPageRoute() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
	});
	const { data: response } = useGetRolesSuspense();

	return (
		<RoleListScreen
			roles={response.data ?? []}
			totalCount={response.meta?.total ?? response.data?.length ?? 0}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onClickCreateButton={() => {
				router.push("/roles/new" as Route);
			}}
		/>
	);
});

"use client";

import { type SpaceDto, useGetSpaces } from "@cocrepo/api/core/spaces";
import {
	adminSpacesPageQueryInputs,
	AdminSpacesPage,
	type AdminSpacesPageSpace,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function SpacesPageRoute() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(
		adminSpacesPageQueryInputs,
	);
	const { data: response, isLoading } = useGetSpaces();
	const spaces = (response?.data ?? []).flatMap(mapSpaceRow);

	return (
		<AdminSpacesPage
			spaces={spaces}
			totalCount={response?.meta?.total ?? spaces.length}
			isLoading={isLoading}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onClickCreateButton={() => {
				router.push("/spaces/new" as Route);
			}}
			onClickSpaceGroundName={(spaceId) => {
				router.push(`/spaces/${spaceId}/ground` as Route);
			}}
		/>
	);
});

function mapSpaceRow(space: SpaceDto): AdminSpacesPageSpace[] {
	const ground = space.ground;
	if (!ground) {
		return [];
	}

	return [
		{
			id: space.id,
			createdAt: space.createdAt,
			name: ground.name,
			label: ground.label ?? null,
			businessNo: ground.businessNo,
			address: ground.address,
			phone: ground.phone,
			email: ground.email,
		},
	];
}

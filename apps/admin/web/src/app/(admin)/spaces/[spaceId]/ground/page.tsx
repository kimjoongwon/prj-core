"use client";

import { type GroundDto, useGetSpaceGround } from "@cocrepo/api/core/spaces";
import { GroundDetailPage } from "@cocrepo/ui";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

type GroundDetailPageParams = {
	spaceId: string;
};

export default function AdminSpacesSpaceIdGroundRoute() {
	const { spaceId } = useParams<GroundDetailPageParams>();
	const router = useRouter();
	const { data: response, isLoading } = useGetSpaceGround(spaceId);
	const ground = response?.data as GroundDto | undefined;

	const onClickBackButton = () => {
		router.push("/spaces" as Route);
	};

	const onClickEditButton = () => {
		router.push(`/spaces/${spaceId}/ground/edit` as Route);
	};

	return (
		<GroundDetailPage
			spaceId={spaceId}
			ground={
				ground
					? {
							name: ground.name,
							label: ground.label,
							address: ground.address,
							phone: ground.phone,
							email: ground.email,
							businessNo: ground.businessNo,
							createdAt: ground.createdAt,
							updatedAt: ground.updatedAt,
						}
					: undefined
			}
			isLoading={isLoading}
			isNotFound={!isLoading && !ground}
			onClickBackButton={onClickBackButton}
			onClickEditButton={onClickEditButton}
		/>
	);
}

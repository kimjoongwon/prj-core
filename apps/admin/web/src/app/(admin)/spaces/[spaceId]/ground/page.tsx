"use client";

import { type GroundDto, useGetSpaceGround } from "@cocrepo/api/core/spaces";
import { Button, GroundEditScreen, GroundFormState } from "@cocrepo/ui";
import { Pencil } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type GroundRouteParams = {
	spaceId: string;
};

const AdminSpacesSpaceIdGroundRoute = observer(() => {
	const { spaceId } = useParams<GroundRouteParams>();
	const router = useRouter();
	const state = useLocalObservable(() => new GroundFormState());
	const routeState = useLocalObservable(() => ({
		isInitialized: false,
	}));
	const { data: response, isLoading } = useGetSpaceGround(spaceId);
	const ground = response?.data as GroundDto | undefined;

	useEffect(() => {
		if (ground && !routeState.isInitialized) {
			state.setFromDto(ground);
			routeState.isInitialized = true;
		}
	}, [ground, routeState, state]);

	const onClickBackButton = () => {
		router.push("/spaces" as Route);
	};

	const onClickEditButton = () => {
		router.push(`/spaces/${spaceId}/ground/edit` as Route);
	};

	return (
		<GroundEditScreen
			title={ground?.name ?? "시설 정보"}
			description="시설 기본 정보를 확인합니다."
			state={state}
			readOnly
			isLoading={isLoading}
			isNotFound={!isLoading && !ground}
			isSubmitPending={false}
			actions={
				<Button
					color="primary"
					variant="flat"
					startContent={<Pencil className="h-4 w-4" />}
					onPress={onClickEditButton}
				>
					수정
				</Button>
			}
			onClickCancelButton={onClickBackButton}
		/>
	);
});

export default AdminSpacesSpaceIdGroundRoute;

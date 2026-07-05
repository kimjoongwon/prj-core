"use client";

import { toast } from "@heroui/react";
import {
	type GroundDto,
	useGetSpaceGround,
	useUpdateSpaceGround,
} from "@cocrepo/api/core/spaces";
import { GroundEditScreen, GroundFormState } from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type GroundEditScreenParams = {
	spaceId: string;
};

const AdminSpacesSpaceIdGroundEditRoute = observer(() => {
	const { spaceId } = useParams<GroundEditScreenParams>();
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

	const { mutate: updateSpaceGround, isPending } = useUpdateSpaceGround({
		mutation: {
			onSuccess: () => {
				toast.success("시설 정보 수정 성공", { description: "시설 detail이 성공적으로 수정되었습니다." });
				router.push(`/spaces/${spaceId}/ground` as Route);
			},
			onError: (error) => {
				toast.danger("시설 정보 수정 실패", { description: error.message || "시설 detail 수정 중 오류가 발생했습니다." });
			},
		},
	});

	const onClickCancelButton = () => {
		router.push(`/spaces/${spaceId}/ground` as Route);
	};

	const onClickSaveButton = () => {
		if (!state.validate()) {
			return;
		}

		updateSpaceGround({
			spaceId,
			data: state.toUpdateDto(),
		});
	};

	return (
		<>
			<GroundEditScreen
				title="시설 정보 수정"
				description={
					ground?.name
						? `${ground.name} 시설 detail을 수정합니다.`
						: "시설 detail을 수정합니다."
				}
				state={state}
				isLoading={isLoading}
				isNotFound={!isLoading && !ground}
				isSubmitPending={isPending}
				onClickCancelButton={onClickCancelButton}
				onClickSaveButton={onClickSaveButton}
			/>
		</>
	);
});

export default AdminSpacesSpaceIdGroundEditRoute;

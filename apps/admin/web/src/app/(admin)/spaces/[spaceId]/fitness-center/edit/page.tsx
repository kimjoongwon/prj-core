"use client";

import type { FitnessCenterDto } from "@cocrepo/api/core/spaces";
import {
	useGetSpaceFitnessCenter,
	useUpdateSpaceFitnessCenter,
} from "@cocrepo/api/core/spaces";
import { FitnessCenterEditScreen, FitnessCenterFormState } from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type FitnessCenterEditScreenParams = {
	spaceId: string;
};

const toFitnessCenterFormStateDto = (
	fitnessCenter?: FitnessCenterDto | null,
) => {
	if (!fitnessCenter) {
		return null;
	}
	return {
		name: fitnessCenter.name,
		label: fitnessCenter.label,
		address: fitnessCenter.address,
		phone: fitnessCenter.phone,
		email: fitnessCenter.email,
		imageFileId: fitnessCenter.imageFileId ?? null,
		space: fitnessCenter.space
			? { contentLanguageCode: fitnessCenter.space.contentLanguageCode }
			: null,
	};
};

const AdminSpacesSpaceIdFitnessCenterEditRoute = observer(() => {
	const { spaceId } = useParams<FitnessCenterEditScreenParams>();
	const router = useRouter();
	const state = useLocalObservable(() => new FitnessCenterFormState());
	const routeState = useLocalObservable(() => ({
		isInitialized: false,
	}));

	const { data: response, isLoading } = useGetSpaceFitnessCenter(spaceId);
	const fitnessCenter = response?.data;

	useEffect(() => {
		if (fitnessCenter && !routeState.isInitialized) {
			state.setFromDto(toFitnessCenterFormStateDto(fitnessCenter));
			routeState.isInitialized = true;
		}
	}, [fitnessCenter, routeState, state]);

	const { mutate: updateSpaceFitnessCenter, isPending: isSubmitPending } =
		useUpdateSpaceFitnessCenter({
			mutation: {
				onSuccess: () => {
					toast.success("피트니스센터 정보 수정 성공", {
						description: "피트니스센터 정보를 수정했습니다.",
					});
					router.push(`/spaces/${spaceId}/fitness-center` as Route);
				},
				onError: (error) => {
					toast.danger("피트니스센터 정보 수정 실패", {
						description:
							error instanceof Error
								? error.message
								: "피트니스센터 정보 수정 중 오류가 발생했습니다.",
					});
				},
			},
		});

	const onClickCancelButton = () => {
		router.push(`/spaces/${spaceId}/fitness-center` as Route);
	};

	const onClickSaveButton = () => {
		if (!state.validate()) {
			return;
		}

		updateSpaceFitnessCenter({
			spaceId,
			data: state.toUpdateDto(),
		});
	};

	return (
		<FitnessCenterEditScreen
			title="피트니스센터 정보 수정"
			description={
				fitnessCenter?.name
					? `${fitnessCenter.name} 피트니스센터를 수정합니다.`
					: "피트니스센터를 수정합니다."
			}
			state={state}
			isLoading={isLoading}
			isNotFound={!isLoading && !fitnessCenter}
			isSubmitPending={isSubmitPending}
			onClickCancelButton={onClickCancelButton}
			onClickSaveButton={onClickSaveButton}
		/>
	);
});

export default AdminSpacesSpaceIdFitnessCenterEditRoute;

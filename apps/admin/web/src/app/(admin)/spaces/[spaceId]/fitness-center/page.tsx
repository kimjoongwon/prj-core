"use client";

import type { FitnessCenterDto } from "@cocrepo/api/core/spaces";
import { useGetSpaceFitnessCenter } from "@cocrepo/api/core/spaces";
import {
	Button,
	FitnessCenterEditScreen,
	FitnessCenterFormState,
} from "@cocrepo/ui";
import { Pencil } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type FitnessCenterRouteParams = {
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

const AdminSpacesSpaceIdFitnessCenterRoute = observer(() => {
	const { spaceId } = useParams<FitnessCenterRouteParams>();
	const router = useRouter();
	const state = useLocalObservable(() => new FitnessCenterFormState());
	const { data: response, isLoading } = useGetSpaceFitnessCenter(spaceId);
	const routeState = useLocalObservable(() => ({
		isInitialized: false,
	}));
	const fitnessCenter = response?.data;

	useEffect(() => {
		if (fitnessCenter && !routeState.isInitialized) {
			state.setFromDto(toFitnessCenterFormStateDto(fitnessCenter));
			routeState.isInitialized = true;
		}
	}, [fitnessCenter, routeState, state]);

	const onClickBackButton = () => {
		router.push("/spaces" as Route);
	};

	const onClickEditButton = () => {
		router.push(`/spaces/${spaceId}/fitness-center/edit` as Route);
	};

	return (
		<FitnessCenterEditScreen
			title={fitnessCenter?.name ?? "피트니스센터 정보"}
			description="시설 기본 정보를 확인합니다."
			state={state}
			readOnly
			isLoading={isLoading}
			isNotFound={!isLoading && !fitnessCenter}
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

export default AdminSpacesSpaceIdFitnessCenterRoute;

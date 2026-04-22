"use client";

import { useCreateTimeline } from "@cocrepo/api/core/timelines";
import { TimelineCreatePage } from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

const AdminTimelinesNewRoute = observer(() => {
	const router = useRouter();
	const state = useLocalObservable(() => ({
		name: "",
		description: "",
		errors: {} as Record<string, string>,
	}));

	const { mutate: createTimeline, isPending } = useCreateTimeline();

	const onClickCancelButton = () => {
		router.push("/timelines" as Route);
	};

	const onChangeNameInput = (value: string) => {
		state.name = value;
		delete state.errors.name;
	};

	const onChangeDescriptionTextarea = (value: string) => {
		state.description = value;
		delete state.errors.description;
	};

	const onClickSubmitButton = () => {
		const errors: Record<string, string> = {};

		if (!state.name.trim()) {
			errors.name = "타임라인명을 입력해주세요.";
		} else if (state.name.trim().length > 100) {
			errors.name = "타임라인명은 100자 이하로 입력해주세요.";
		}

		if (state.description.length > 500) {
			errors.description = "설명은 500자 이하로 입력해주세요.";
		}

		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		createTimeline(
			{
				data: {
					name: state.name.trim(),
					description: state.description.trim() || undefined,
				},
			},
			{
				onSuccess: (response) => {
					addToast({
						title: "등록 성공",
						description: "타임라인이 등록되었습니다.",
						color: "success",
					});
					const newId = response.data?.id;
					if (newId) {
						router.push(`/timelines/${newId}` as Route);
						return;
					}
					router.push("/timelines" as Route);
				},
				onError: () => {
					addToast({
						title: "등록 실패",
						description:
							"타임라인 등록 중 오류가 발생했습니다. 이름이 중복되지 않았는지 확인해주세요.",
						color: "danger",
					});
				},
			},
		);
	};

	return (
		<TimelineCreatePage
			name={state.name}
			description={state.description}
			nameError={state.errors.name}
			descriptionError={state.errors.description}
			isSubmitPending={isPending}
			isSubmitDisabled={!state.name.trim()}
			onChangeNameInput={onChangeNameInput}
			onChangeDescriptionTextarea={onChangeDescriptionTextarea}
			onClickCancelButton={onClickCancelButton}
			onClickSubmitButton={onClickSubmitButton}
		/>
	);
});

export default AdminTimelinesNewRoute;

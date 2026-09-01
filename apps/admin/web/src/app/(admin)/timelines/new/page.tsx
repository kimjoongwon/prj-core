"use client";

import { useCreateTimeline } from "@cocrepo/api/core/timelines";
import { useApp } from "@cocrepo/store";
import {
	Button,
	TimelineEditScreen,
	type TimelineFormState,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

const AdminTimelinesNewRoute = observer(() => {
	const router = useRouter();
	const app = useApp();
	const state = useLocalObservable<TimelineFormState>(() => ({
		name: "",
		description: "",
		errors: {},
	}));

	const { mutate: createTimeline, isPending } = useCreateTimeline();

	const onClickSubmitButton = () => {
		const errors: TimelineFormState["errors"] = {};

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
					toast.success("등록 성공", {
						description: "타임라인이 등록되었습니다.",
					});
					const newId = response.data?.id;
					if (newId) {
						router.push(`/timelines/${newId}` as Route);
						return;
					}
					router.push("/timelines" as Route);
				},
				onError: () => {
					toast.danger("등록 실패", {
						description:
							"타임라인 등록 중 오류가 발생했습니다. 이름이 중복되지 않았는지 확인해주세요.",
					});
				},
			},
		);
	};

	return (
		<TimelineEditScreen
			title="타임라인 등록"
			description="새 타임라인을 등록합니다."
			state={state}
			contentLanguageCode={app.contentLanguageCode}
			actions={
				<div className="flex gap-2">
					<Button
						variant="tertiary"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push("/timelines" as Route);
						}}
					>
						목록으로
					</Button>
					<Button
						variant="primary"
						startContent={<Save className="h-4 w-4" />}
						isLoading={isPending}
						isDisabled={!state.name.trim()}
						onPress={onClickSubmitButton}
					>
						등록
					</Button>
				</div>
			}
		/>
	);
});

export default AdminTimelinesNewRoute;

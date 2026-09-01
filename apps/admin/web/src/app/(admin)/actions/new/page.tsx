"use client";

import { useCreateAction } from "@cocrepo/api/core/actions";
import { ActionEditScreen, type ActionFormState, Button } from "@cocrepo/ui";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function ActionNewPageRoute() {
	const router = useRouter();
	const state = useLocalObservable<ActionFormState>(() => ({
		name: "",
		displayName: "",
		description: "",
		group: "",
		order: 0,
		errors: {
			name: "",
		},
	}));
	const { mutate: createAction, isPending } = useCreateAction({
		mutation: {
			onSuccess: (response) => {
				const actionId = response.data?.id;
				if (actionId) {
					router.push(`/actions/${actionId}` as Route);
					return;
				}

				router.push("/actions" as Route);
			},
		},
	});

	const onSubmit = () => {
		let isValid = true;
		if (!state.name.trim()) {
			state.errors.name = "행위 식별자를 입력해주세요.";
			isValid = false;
		} else if (!/^[a-z][a-z0-9:_]*$/.test(state.name)) {
			state.errors.name =
				"소문자로 시작하고, 소문자/숫자/콜론/밑줄만 사용 가능합니다. (예: read:masked:email)";
			isValid = false;
		} else {
			state.errors.name = "";
		}
		if (!isValid) {
			return;
		}

		createAction({
			data: {
				name: state.name,
				displayName: state.displayName || undefined,
				description: state.description || undefined,
				group: state.group || undefined,
				order: state.order,
			},
		});
	};

	return (
		<ActionEditScreen
			title="Action 등록"
			description="새로운 Action을 등록합니다."
			state={state}
			actions={
				<div className="flex gap-2">
					<Button
						variant="ghost"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push("/actions" as Route);
						}}
					>
						목록으로
					</Button>
					<Button
						variant="primary"
						startContent={<Save className="h-4 w-4" />}
						onPress={onSubmit}
						isLoading={isPending}
					>
						Action 등록
					</Button>
				</div>
			}
		/>
	);
});

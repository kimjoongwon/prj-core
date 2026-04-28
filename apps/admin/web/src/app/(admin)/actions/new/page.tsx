"use client";

import { useCreateAction } from "@cocrepo/api/core/actions";
import { ActionCreatePage, type ActionCreatePageFormState } from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function ActionNewPageRoute() {
	const router = useRouter();
	const state = useLocalObservable<ActionCreatePageFormState>(() => ({
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
				isSystem: false,
			},
		});
	};

	return (
		<ActionCreatePage
			formState={state}
			isSubmitting={isPending}
			onClickBackButton={() => {
				router.push("/actions" as Route);
			}}
			onChangeNameInput={(value) => {
				state.name = value.toLowerCase();
				state.errors.name = "";
			}}
			onChangeDisplayNameInput={(value) => {
				state.displayName = value;
			}}
			onChangeDescriptionTextarea={(value) => {
				state.description = value;
			}}
			onChangeGroupSelection={(value) => {
				state.group = value;
			}}
			onChangeOrderInput={(value) => {
				state.order = Number(value) || 0;
			}}
			onSubmit={() => {
				onSubmit();
			}}
		/>
	);
});

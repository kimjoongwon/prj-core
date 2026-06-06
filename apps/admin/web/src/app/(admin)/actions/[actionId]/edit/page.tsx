"use client";

import {
	type UpdateActionDto,
	useGetActionById,
	useUpdateAction,
} from "@cocrepo/api/core/actions";
import { ActionEditPage, type ActionEditPageFormState } from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default observer(function ActionEditPageRoute() {
	const actionId = useParams<{ actionId: string }>().actionId;
	const router = useRouter();
	const state = useLocalObservable<ActionEditPageFormState>(() => ({
		displayName: "",
		description: "",
		group: "",
		order: 0,
	}));
	const { data: response, isLoading } = useGetActionById(actionId);
	const { mutate: updateAction, isPending } = useUpdateAction({
		mutation: {
			onSuccess: () => {
				router.push(`/actions/${actionId}` as Route);
			},
		},
	});

	useEffect(() => {
		if (!response?.data) {
			return;
		}
		state.displayName = response.data.displayName || "";
		state.description = response.data.description || "";
		state.group = response.data.group || "";
		state.order = response.data.order;
	}, [response?.data, state]);

	return (
		<ActionEditPage
			action={
				response?.data
					? {
							actionId: response.data.id,
							name: response.data.name,
							displayName: response.data.displayName,
							description: response.data.description,
							group: response.data.group,
							order: response.data.order,
							isSystem: response.data.isSystem,
						}
					: undefined
			}
			formState={state}
			isLoading={isLoading}
			isSubmitting={isPending}
			onClickBackButton={() => {
				router.push(`/actions/${actionId}` as Route);
			}}
			onClickListButton={() => {
				router.push("/actions" as Route);
			}}
			onChangeDisplayNameInput={(value) => {
				state.displayName = value;
			}}
			onChangeDescriptionTextArea={(value) => {
				state.description = value;
			}}
			onChangeGroupSelection={(value) => {
				state.group = value;
			}}
			onChangeOrderInput={(value) => {
				state.order = Number(value) || 0;
			}}
			onSubmit={() => {
				const data: UpdateActionDto = {
					displayName: state.displayName || undefined,
					description: state.description || undefined,
					group: state.group || undefined,
					order: state.order,
				};
				updateAction({ id: actionId, data });
			}}
		/>
	);
});

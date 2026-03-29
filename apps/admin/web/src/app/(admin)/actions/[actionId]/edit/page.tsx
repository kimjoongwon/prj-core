"use client";

import {
	type UpdateActionDto,
	useGetActionById,
	useUpdateAction,
} from "@cocrepo/api/core/actions";
import { AdminActionsActionIdEditPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

export default observer(function ActionEditPageRoute() {
	const actionId = useParams<{ actionId: string }>().actionId;
	const router = useRouter();
	const { data: response, isLoading } = useGetActionById(actionId);
	const { mutate: updateAction, isPending } = useUpdateAction({
		mutation: {
			onSuccess: () => {
				router.push(`/actions/${actionId}` as Route);
			},
		},
	});

	return (
		<AdminActionsActionIdEditPage
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
			isLoading={isLoading}
			isSubmitting={isPending}
			onClickBackButton={() => {
				router.push(`/actions/${actionId}` as Route);
			}}
			onClickListButton={() => {
				router.push("/actions" as Route);
			}}
			onSubmit={(form) => {
				const data: UpdateActionDto = {
					displayName: form.displayName || undefined,
					description: form.description || undefined,
					group: form.group || undefined,
					order: form.order,
				};
				updateAction({ id: actionId, data });
			}}
		/>
	);
});

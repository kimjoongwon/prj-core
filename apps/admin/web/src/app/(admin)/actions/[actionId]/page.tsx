"use client";

import {
	type ActionResponseDto,
	useDeleteAction,
	useGetActionById,
} from "@cocrepo/api/core/actions";
import { ActionDetailScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

export default observer(function ActionDetailScreenRoute() {
	const actionId = useParams<{ actionId: string }>().actionId;
	const router = useRouter();
	const { data: response, isLoading } = useGetActionById(actionId);
	const action = response?.data as ActionResponseDto | undefined;
	const { mutate: deleteAction, isPending: isDeleting } = useDeleteAction({
		mutation: {
			onSuccess: () => {
				router.push("/actions" as Route);
			},
		},
	});

	return (
		<>
			<ActionDetailScreen
				action={
					action
						? {
								id: action.id,
								name: action.name,
								displayName: action.displayName,
								group: action.group,
								order: action.order,
								description: action.description,
								config: action.config,
								isSystem: action.isSystem,
								createdAt: action.createdAt,
								updatedAt: action.updatedAt,
							}
						: undefined
				}
				isLoading={isLoading}
				isDeleting={isDeleting}
				onClickBackButton={() => {
					router.push("/actions" as Route);
				}}
				onClickEditButton={() => {
					router.push(`/actions/${actionId}/edit` as Route);
				}}
				onClickDeleteConfirmButton={() => {
					deleteAction({ id: actionId });
				}}
			/>
		</>
	);
});

"use client";

import { useCreateAction } from "@cocrepo/api/core/actions";
import { AdminActionsNewPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function ActionNewPageRoute() {
	const router = useRouter();
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

	return (
		<AdminActionsNewPage
			isSubmitting={isPending}
			onClickBackButton={() => {
				router.push("/actions" as Route);
			}}
			onSubmit={(form) => {
				createAction({
					data: {
						name: form.name,
						displayName: form.displayName || undefined,
						description: form.description || undefined,
						group: form.group || undefined,
						order: form.order,
						isSystem: false,
					},
				});
			}}
		/>
	);
});

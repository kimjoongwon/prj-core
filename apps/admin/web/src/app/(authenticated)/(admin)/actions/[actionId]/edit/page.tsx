"use client";

import {
	type UpdateActionDto,
	useGetActionById,
	useUpdateAction,
} from "@cocrepo/api/core/actions";
import {
	ActionEditScreen,
	type ActionFormState,
	Button,
	HStack,
} from "@cocrepo/ui";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default observer(function ActionEditScreenRoute() {
	const actionId = useParams<{ actionId: string }>().actionId;
	const router = useRouter();
	const state = useLocalObservable<ActionFormState>(() => ({
		name: "",
		displayName: "",
		description: "",
		group: "",
		order: 0,
		errors: {},
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
		state.name = response.data.name;
		state.displayName = response.data.displayName || "";
		state.description = response.data.description || "";
		state.group = response.data.group || "";
		state.order = response.data.order;
	}, [response?.data, state]);

	return (
		<ActionEditScreen
			title="Action 수정"
			description={
				response?.data
					? `${response.data.displayName || response.data.name} Action을 수정합니다.`
					: "Action을 찾을 수 없습니다."
			}
			state={response?.data ? state : undefined}
			isLoading={isLoading}
			notFound={!isLoading && !response?.data}
			notFoundAction={
				<Button
					variant="tertiary"
					onPress={() => {
						router.push("/actions" as Route);
					}}
				>
					목록으로
				</Button>
			}
			actions={
				<HStack>
					<Button
						variant="ghost"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push(`/actions/${actionId}` as Route);
						}}
					>
						상세로 돌아가기
					</Button>
					<Button
						variant="primary"
						startContent={<Save className="h-4 w-4" />}
						onPress={() => {
							const data: UpdateActionDto = {
								displayName: state.displayName || undefined,
								description: state.description || undefined,
								group: state.group || undefined,
								order: state.order,
							};
							updateAction({ id: actionId, data });
						}}
						isLoading={isPending}
					>
						저장
					</Button>
				</HStack>
			}
		/>
	);
});

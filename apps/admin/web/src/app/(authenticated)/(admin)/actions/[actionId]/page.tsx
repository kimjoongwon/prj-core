"use client";

import {
	type ActionResponseDto,
	useDeleteAction,
	useGetActionById,
} from "@cocrepo/api/core/actions";
import {
	ActionEditScreen,
	type ActionFormState,
	Button,
	HStack,
	InfoList,
	Section,
} from "@cocrepo/ui";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

export default observer(function ActionDetailRoute() {
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
	const state: ActionFormState | undefined = action
		? {
				name: action.name,
				displayName: action.displayName ?? "",
				description: action.description ?? "",
				group: action.group ?? "",
				order: action.order,
				errors: {},
			}
		: undefined;

	return (
		<ActionEditScreen
			title="Action 상세"
			description={
				action
					? `${action.displayName || action.name} Action의 상세 정보입니다.`
					: "Action을 찾을 수 없습니다."
			}
			state={state}
			readOnly
			isLoading={isLoading}
			notFound={!isLoading && !action}
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
							router.push("/actions" as Route);
						}}
					>
						목록으로
					</Button>
					{action ? (
						<>
							<Button
								variant="tertiary"
								startContent={<Edit className="h-4 w-4" />}
								onPress={() => {
									router.push(`/actions/${actionId}/edit` as Route);
								}}
							>
								수정
							</Button>
							<Button
								variant="tertiary"
								startContent={<Trash2 className="h-4 w-4" />}
								isLoading={isDeleting}
								onPress={() => {
									deleteAction({ id: actionId });
								}}
							>
								삭제
							</Button>
						</>
					) : null}
				</HStack>
			}
		>
			{action?.config !== null && action?.config !== undefined ? (
				<Section>
					<Section.Header title="설정 (Config)" />
					<Section.Body>
						<pre className="overflow-x-auto rounded-lg bg-default p-4 text-sm dark:bg-default/5">
							{JSON.stringify(action.config, null, 2)}
						</pre>
					</Section.Body>
				</Section>
			) : null}
			{action ? (
				<Section>
					<Section.Header title="추가 정보" />
					<Section.Body>
						<InfoList
							items={[
								{
									key: "createdAt",
									label: "생성일",
									value: new Date(action.createdAt).toLocaleString("ko-KR"),
								},
								...(action.updatedAt
									? [
											{
												key: "updatedAt",
												label: "수정일",
												value: new Date(action.updatedAt).toLocaleString(
													"ko-KR",
												),
											},
										]
									: []),
							]}
						/>
					</Section.Body>
				</Section>
			) : null}
		</ActionEditScreen>
	);
});

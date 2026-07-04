"use client";

import {
	type ActionResponseDto,
	useDeleteAction,
	useGetActionById,
} from "@cocrepo/api/core/actions";
import { ActionEditScreen, type ActionFormState, Button } from "@cocrepo/ui";
import { Modal, useOverlayState } from "@heroui/react";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";

export default observer(function ActionDetailRoute() {
	const actionId = useParams<{ actionId: string }>().actionId;
	const router = useRouter();
	const deleteModal = useOverlayState();
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
		<>
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
						variant="flat"
						onPress={() => {
							router.push("/actions" as Route);
						}}
					>
						목록으로
					</Button>
				}
				actions={
					<div className="flex gap-2">
						<Button
							variant="light"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={() => {
								router.push("/actions" as Route);
							}}
						>
							목록으로
						</Button>
						{action && !action.isSystem ? (
							<>
								<Button
									variant="flat"
									color="primary"
									startContent={<Edit className="h-4 w-4" />}
									onPress={() => {
										router.push(`/actions/${actionId}/edit` as Route);
									}}
								>
									수정
								</Button>
								<Button
									variant="flat"
									color="danger"
									startContent={<Trash2 className="h-4 w-4" />}
									onPress={deleteModal.open}
								>
									삭제
								</Button>
							</>
						) : null}
					</div>
				}
			>
				{action?.config !== null && action?.config !== undefined ? (
					<SectionLike title="설정 (Config)">
						<pre className="overflow-x-auto rounded-lg bg-default p-4 text-sm dark:bg-default/5">
							{JSON.stringify(action.config, null, 2)}
						</pre>
					</SectionLike>
				) : null}
				{action ? (
					<SectionLike title="추가 정보">
						<dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<dt className="mb-1 text-sm text-muted">생성일</dt>
								<dd>{new Date(action.createdAt).toLocaleString("ko-KR")}</dd>
							</div>
							{action.updatedAt ? (
								<div>
									<dt className="mb-1 text-sm text-muted">수정일</dt>
									<dd>{new Date(action.updatedAt).toLocaleString("ko-KR")}</dd>
								</div>
							) : null}
						</dl>
					</SectionLike>
				) : null}
			</ActionEditScreen>
			{action ? (
				<Modal state={deleteModal}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header>Action 삭제</Modal.Header>
								<Modal.Body>
									<p>
										<strong>{action.displayName || action.name}</strong>{" "}
										Action을 삭제하시겠습니까?
									</p>
									<p className="mt-2 text-sm text-danger">
										이 작업은 되돌릴 수 없습니다.
									</p>
								</Modal.Body>
								<Modal.Footer>
									<Button
										variant="flat"
										onPress={deleteModal.close}
										isDisabled={isDeleting}
									>
										취소
									</Button>
									<Button
										color="danger"
										onPress={() => {
											deleteAction({ id: actionId });
										}}
										isLoading={isDeleting}
									>
										삭제
									</Button>
								</Modal.Footer>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
				</Modal>
			) : null}
		</>
	);
});

function SectionLike({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section>
			<h3 className="mb-4 text-lg font-semibold">{title}</h3>
			{children}
		</section>
	);
}

"use client";

import {
	useDeleteAbility,
	useGetAbilityById,
} from "@cocrepo/api/core/abilities";
import {
	AbilityEditScreen,
	type AbilityFormOption,
	type AbilityFormState,
	Button,
} from "@cocrepo/ui";
import { Modal, useOverlayState } from "@heroui/react";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";

export default observer(function AbilityDetailRoute() {
	const abilityId = useParams().abilityId as string;
	const router = useRouter();
	const deleteModal = useOverlayState();
	const { data: response, isLoading } = useGetAbilityById(abilityId);
	const ability = response?.data;
	const state: AbilityFormState | undefined = ability
		? {
				name: ability.name,
				description: ability.description || "",
				subjectId: ability.subjectId,
				actionId: ability.actionId,
				fields: ability.fields.join(", "),
				conditions: ability.conditions
					? JSON.stringify(ability.conditions, null, 2)
					: "",
				inverted: ability.inverted,
				reason: ability.reason || "",
			}
		: undefined;
	const subjects: AbilityFormOption[] = ability
		? [
				{
					id: ability.subjectId,
					label: ability.subject?.displayName || ability.subject?.name || "-",
				},
			]
		: [];
	const actions: AbilityFormOption[] = ability
		? [
				{
					id: ability.actionId,
					label: ability.action?.displayName || ability.action?.name || "-",
				},
			]
		: [];

	const { mutate: deleteAbility, isPending: isDeleting } = useDeleteAbility({
		mutation: {
			onSuccess: () => {
				deleteModal.close();
				router.push("/abilities" as Route);
			},
		},
	});

	return (
		<>
			<AbilityEditScreen
				title="Ability 상세"
				description={
					ability
						? `${ability.name} Ability의 상세 정보입니다.`
						: "Ability를 찾을 수 없습니다."
				}
				state={state}
				subjects={subjects}
				actions={actions}
				readOnly
				isLoading={isLoading}
				notFound={!isLoading && !ability}
				notFoundAction={
					<Button
						variant="flat"
						onPress={() => {
							router.push("/abilities" as Route);
						}}
					>
						목록으로
					</Button>
				}
				pageActions={
					<div className="flex gap-2">
						<Button
							variant="flat"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={() => {
								router.push("/abilities" as Route);
							}}
						>
							목록으로
						</Button>
						{ability ? (
							<>
								<Button
									color="primary"
									variant="flat"
									startContent={<Edit className="h-4 w-4" />}
									onPress={() => {
										router.push(`/abilities/${abilityId}/edit` as Route);
									}}
								>
									수정
								</Button>
								<Button
									color="danger"
									variant="flat"
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
				{ability ? (
					<SectionLike title="메타 정보">
						<dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<Info
								label="생성일"
								value={new Date(ability.createdAt).toLocaleString("ko-KR")}
							/>
							{ability.updatedAt ? (
								<Info
									label="수정일"
									value={new Date(ability.updatedAt).toLocaleString("ko-KR")}
								/>
							) : null}
						</dl>
					</SectionLike>
				) : null}
			</AbilityEditScreen>
			{ability ? (
				<Modal state={deleteModal}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header>Ability 삭제</Modal.Header>
								<Modal.Body>
									<p>
										<strong>{ability.name}</strong> Ability를 삭제하시겠습니까?
									</p>
									<p className="mt-2 text-sm text-muted">
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
											deleteAbility({ id: abilityId });
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

function Info({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border border-border bg-background/60 p-3">
			<dt className="text-xs text-muted">{label}</dt>
			<dd className="mt-1 break-all text-sm font-medium">{value}</dd>
		</div>
	);
}

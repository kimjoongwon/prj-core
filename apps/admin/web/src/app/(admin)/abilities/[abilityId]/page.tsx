"use client";

import {
	useDeleteAbility,
	useGetAbilityById,
} from "@cocrepo/api/core/abilities";
import { AbilityDetailPage } from "@cocrepo/ui";
import { useOverlayState } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

export default observer(function AbilityDetailPageRoute() {
	const abilityId = useParams().abilityId as string;
	const router = useRouter();
	const deleteModal = useOverlayState();

	const { data: response, isLoading } = useGetAbilityById(abilityId);
	const ability = response?.data;

	const { mutate: deleteAbility, isPending: isDeleting } = useDeleteAbility({
		mutation: {
			onSuccess: () => {
				deleteModal.close();
				router.push("/abilities" as Route);
			},
		},
	});

	if (isLoading) {
		return <AbilityDetailPage mode="loading" />;
	}

	if (!ability) {
		return (
			<AbilityDetailPage
				mode="not_found"
				onClickBackButton={() => {
					router.push("/abilities" as Route);
				}}
			/>
		);
	}

	return (
		<AbilityDetailPage
			mode="ready"
			ability={{
				id: ability.id,
				name: ability.name,
				description: ability.description || undefined,
				inverted: ability.inverted,
				reason: ability.reason || undefined,
				subjectLabel:
					ability.subject?.displayName || ability.subject?.name || "-",
				actionLabel: ability.action?.displayName || ability.action?.name || "-",
				fields: ability.fields,
				conditions: ability.conditions,
				createdAt: ability.createdAt,
				updatedAt: ability.updatedAt || undefined,
			}}
			isDeleteModalOpen={deleteModal.isOpen}
			isDeleting={isDeleting}
			onClickBackButton={() => {
				router.push("/abilities" as Route);
			}}
			onClickEditButton={() => {
				router.push(`/abilities/${abilityId}/edit` as Route);
			}}
			onOpenDeleteModal={deleteModal.open}
			onCloseDeleteModal={deleteModal.close}
			onClickDeleteConfirm={() => {
				deleteAbility({ id: abilityId });
			}}
		/>
	);
});

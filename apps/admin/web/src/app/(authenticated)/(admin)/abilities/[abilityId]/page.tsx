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
	HStack,
	InfoList,
	Section,
} from "@cocrepo/ui";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

export default observer(function AbilityDetailRoute() {
	const abilityId = useParams().abilityId as string;
	const router = useRouter();
	const { data: response, isLoading } = useGetAbilityById(abilityId);
	const ability = response?.data;
	const state: AbilityFormState | undefined = ability
		? {
				name: ability.name,
				description: ability.description || "",
				subjectId: String(ability.subjectId),
				actionId: String(ability.actionId),
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
					id: String(ability.subjectId),
					label: ability.subject?.displayName || ability.subject?.name || "-",
				},
			]
		: [];
	const actions: AbilityFormOption[] = ability
		? [
				{
					id: String(ability.actionId),
					label: ability.action?.displayName || ability.action?.name || "-",
				},
			]
		: [];

	const { mutate: deleteAbility, isPending: isDeleting } = useDeleteAbility({
		mutation: {
			onSuccess: () => {
				router.push("/abilities" as Route);
			},
		},
	});

	return (
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
					variant="tertiary"
					onPress={() => {
						router.push("/abilities" as Route);
					}}
				>
					목록으로
				</Button>
			}
			pageActions={
				<HStack>
					<Button
						variant="tertiary"
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
								variant="tertiary"
								startContent={<Edit className="h-4 w-4" />}
								onPress={() => {
									router.push(`/abilities/${abilityId}/edit` as Route);
								}}
							>
								수정
							</Button>
							<Button
								variant="tertiary"
								startContent={<Trash2 className="h-4 w-4" />}
								isLoading={isDeleting}
								onPress={() => {
									deleteAbility({ id: abilityId });
								}}
							>
								삭제
							</Button>
						</>
					) : null}
				</HStack>
			}
		>
			{ability ? (
				<Section>
					<Section.Header title="메타 정보" />
					<Section.Body>
						<InfoList
							items={[
								{
									key: "createdAt",
									label: "생성일",
									value: new Date(ability.createdAt).toLocaleString("ko-KR"),
								},
								...(ability.updatedAt
									? [
											{
												key: "updatedAt",
												label: "수정일",
												value: new Date(ability.updatedAt).toLocaleString(
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
		</AbilityEditScreen>
	);
});

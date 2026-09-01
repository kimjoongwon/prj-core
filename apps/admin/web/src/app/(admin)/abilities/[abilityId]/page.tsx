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
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";

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
				<div className="flex gap-2">
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

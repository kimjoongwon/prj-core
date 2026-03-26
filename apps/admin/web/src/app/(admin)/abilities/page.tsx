"use client";

import {
	type AbilityResponseDto,
	useGetAbilities,
} from "@cocrepo/api/core/abilities";
import { useGetActions } from "@cocrepo/api/core/actions";
import { useGetSubjects } from "@cocrepo/api/core/subjects";
import { AbilityListPage, type AbilityListPageAbility } from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function AbilitiesPage() {
	const router = useRouter();
	const state = useLocalObservable(() => ({
		searchTerm: "",
		selectedSubjectId: "",
		selectedActionId: "",
		selectedInverted: "",
	}));

	const { data: abilitiesResponse, isLoading: isAbilitiesLoading } =
		useGetAbilities();
	const { data: subjectsResponse, isLoading: isSubjectsLoading } =
		useGetSubjects();
	const { data: actionsResponse, isLoading: isActionsLoading } =
		useGetActions();

	const abilities = abilitiesResponse?.data ?? [];
	const filteredAbilities = abilities
		.filter((ability) => {
			if (
				state.searchTerm &&
				!ability.name.toLowerCase().includes(state.searchTerm.toLowerCase())
			) {
				return false;
			}

			if (
				state.selectedSubjectId &&
				ability.subjectId !== state.selectedSubjectId
			) {
				return false;
			}

			if (
				state.selectedActionId &&
				ability.actionId !== state.selectedActionId
			) {
				return false;
			}

			if (state.selectedInverted !== "") {
				const invertedBool = state.selectedInverted === "true";
				if (ability.inverted !== invertedBool) {
					return false;
				}
			}

			return true;
		})
		.map(mapAbilityListItem);

	const subjects = (subjectsResponse?.data ?? []).map((subject) => ({
		id: subject.id,
		label: subject.displayName || subject.name,
	}));
	const actions = (actionsResponse?.data ?? []).map((action) => ({
		id: action.id,
		label: action.displayName || action.name,
	}));

	return (
		<AbilityListPage
			abilities={filteredAbilities}
			totalCount={abilities.length}
			subjects={subjects}
			actions={actions}
			filters={{
				searchTerm: state.searchTerm,
				selectedSubjectId: state.selectedSubjectId,
				selectedActionId: state.selectedActionId,
				selectedInverted: state.selectedInverted,
			}}
			isLoading={isAbilitiesLoading || isSubjectsLoading || isActionsLoading}
			onChangeSearchTerm={(value) => {
				state.searchTerm = value;
			}}
			onChangeSubjectId={(value) => {
				state.selectedSubjectId = value;
			}}
			onChangeActionId={(value) => {
				state.selectedActionId = value;
			}}
			onChangeInverted={(value) => {
				state.selectedInverted = value;
			}}
			onClickResetFiltersButton={() => {
				state.searchTerm = "";
				state.selectedSubjectId = "";
				state.selectedActionId = "";
				state.selectedInverted = "";
			}}
			onClickAbilityRow={(abilityId) => {
				router.push(`/abilities/${abilityId}` as Route);
			}}
			onClickCreateButton={() => {
				router.push("/abilities/new" as Route);
			}}
		/>
	);
});

function mapAbilityListItem(
	ability: AbilityResponseDto,
): AbilityListPageAbility {
	return {
		id: ability.id,
		name: ability.name,
		subjectId: ability.subjectId,
		actionId: ability.actionId,
		subjectLabel: ability.subject?.displayName || ability.subject?.name || "-",
		actionLabel: ability.action?.displayName || ability.action?.name || "-",
		inverted: ability.inverted,
		fieldCount: ability.fields.length,
		hasConditions: Boolean(ability.conditions),
		createdAt: ability.createdAt,
	};
}

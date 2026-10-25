"use client";

import {
	type AbilityResponseDto,
	useGetAbilitiesSuspense,
} from "@cocrepo/api/core/abilities";
import { useGetActionsSuspense } from "@cocrepo/api/core/actions";
import {
	type SubjectDto,
	useGetSubjectsSuspense,
} from "@cocrepo/api/core/subjects";
import { AbilityListScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

function getTextValue(value: string | null | undefined) {
	return value?.trim().toLowerCase() ?? "";
}

function getAbilitySearchText(ability: AbilityResponseDto) {
	return [
		ability.name,
		ability.description,
		ability.reason,
		ability.subject?.displayName,
		ability.subject?.name,
		ability.action?.displayName,
		ability.action?.name,
	]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();
}

function hasConditions(ability: AbilityResponseDto) {
	return Boolean(
		ability.conditions &&
			typeof ability.conditions === "object" &&
			Object.keys(ability.conditions).length > 0,
	);
}

function filterAbilities(
	abilities: AbilityResponseDto[],
	subjects: SubjectDto[],
	filters: {
		search: string;
		subjectId: string;
		actionId: string;
		inverted: string;
	},
) {
	const searchTerm = getTextValue(filters.search);
	// AbilityResponseDto의 subject 관계에는 공개 id가 없어 name으로 매칭한다.
	const selectedSubjectName = filters.subjectId
		? subjects.find((subject) => subject.id === filters.subjectId)?.name
		: undefined;

	return abilities.filter((ability) => {
		if (searchTerm && !getAbilitySearchText(ability).includes(searchTerm)) {
			return false;
		}

		if (
			filters.subjectId &&
			ability.subject?.name !== selectedSubjectName
		) {
			return false;
		}

		if (filters.actionId && ability.action?.id !== filters.actionId) {
			return false;
		}

		if (filters.inverted !== "") {
			const invertedBool = filters.inverted === "true";
			if (ability.inverted !== invertedBool) {
				return false;
			}
		}

		return true;
	});
}

function buildAbilitySummary(
	abilities: AbilityResponseDto[],
	filteredAbilities: AbilityResponseDto[],
) {
	return {
		total: abilities.length,
		filtered: filteredAbilities.length,
		allow: abilities.filter((ability) => !ability.inverted).length,
		deny: abilities.filter((ability) => ability.inverted).length,
		conditional: abilities.filter((ability) => hasConditions(ability)).length,
		fieldScoped: abilities.filter((ability) => ability.fields.length > 0)
			.length,
	};
}

export default observer(function AbilitiesPage() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		search: parseAsString.withDefault(""),
		subjectId: parseAsString.withDefault(""),
		actionId: parseAsString.withDefault(""),
		inverted: parseAsString.withDefault(""),
	});

	const { data: abilitiesResponse } = useGetAbilitiesSuspense();
	const { data: subjectsResponse } = useGetSubjectsSuspense();
	const { data: actionsResponse } = useGetActionsSuspense();

	const abilities = abilitiesResponse.data ?? [];
	const subjects = subjectsResponse.data ?? [];
	const filteredAbilities = filterAbilities(abilities, subjects, {
		search: queryStates.search,
		subjectId: queryStates.subjectId,
		actionId: queryStates.actionId,
		inverted: queryStates.inverted,
	});
	const paginatedAbilities = filteredAbilities.slice(
		queryStates.skip,
		queryStates.skip + queryStates.take,
	);
	const summary = buildAbilitySummary(abilities, filteredAbilities);

	const subjectOptions = subjects.map((subject) => ({
		id: subject.id,
		label: subject.displayName || subject.name,
	}));
	const actionOptions = (actionsResponse.data ?? []).map((action) => ({
		id: action.id,
		label: action.displayName || action.name,
	}));

	return (
		<AbilityListScreen
			abilities={paginatedAbilities}
			totalCount={filteredAbilities.length}
			summary={summary}
			subjects={subjectOptions}
			actions={actionOptions}
			filters={{
				searchTerm: queryStates.search,
				selectedSubjectId: queryStates.subjectId,
				selectedActionId: queryStates.actionId,
				selectedInverted: queryStates.inverted,
			}}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onChangeSearchTerm={(value) => {
				void setQueryStates({ search: value, skip: 0 });
			}}
			onChangeSubjectId={(value) => {
				void setQueryStates({ subjectId: value, skip: 0 });
			}}
			onChangeActionId={(value) => {
				void setQueryStates({ actionId: value, skip: 0 });
			}}
			onChangeInverted={(value) => {
				void setQueryStates({ inverted: value, skip: 0 });
			}}
			onClickResetFiltersButton={() => {
				void setQueryStates({
					search: "",
					subjectId: "",
					actionId: "",
					inverted: "",
					skip: 0,
				});
			}}
			onClickAbilityRow={(abilityId) => {
				router.push(`/abilities/${String(abilityId)}` as Route);
			}}
			onClickCreateButton={() => {
				router.push("/abilities/new" as Route);
			}}
		/>
	);
});

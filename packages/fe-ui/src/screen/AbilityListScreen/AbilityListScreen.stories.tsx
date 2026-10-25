import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { ComponentProps } from "react";
import { AbilityListScreen } from "./AbilityListScreen";
import { useStorybookState } from "../../storybook";

const abilityFixtures: NonNullable<
	ComponentProps<typeof AbilityListScreen>["abilities"]
> = [
	{
		action: {
			description: null,
			group: null,
			config: null,
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			displayName: "조회",
			id: "ACT00000000000000000000001",
			name: "read",
			order: 1,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
		reason: null,
		conditions: null,
		createdAt: new Date("2026-04-14T09:00:00.000Z"),
		description: "이용자 기본 정보를 확인합니다.",
		fields: [],
		id: "ABT00000000000000000000021",
		inverted: false,
		name: "Can 조회 사용자",
		subject: {
			displayName: "사용자",
			fieldCount: 12,
			name: "User",
		},
		updatedAt: new Date("2026-04-14T09:00:00.000Z"),
	},
	{
		action: {
			description: null,
			group: null,
			config: null,
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			displayName: "수정",
			id: "ACT00000000000000000000002",
			name: "update",
			order: 2,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
		reason: null,
		conditions: { spaceId: "current" },
		createdAt: new Date("2026-04-14T09:00:00.000Z"),
		description: "현재 공간의 예약만 수정합니다.",
		fields: ["name", "startedAt"],
		id: "ABT00000000000000000000022",
		inverted: false,
		name: "Can 수정 예약",
		subject: {
			displayName: "예약",
			fieldCount: 8,
			name: "Reservation",
		},
		updatedAt: new Date("2026-04-14T09:00:00.000Z"),
	},
	{
		action: {
			description: null,
			group: null,
			config: null,
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			displayName: "삭제",
			id: "ACT00000000000000000000003",
			name: "delete",
			order: 3,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
		conditions: null,
		createdAt: new Date("2026-04-14T09:00:00.000Z"),
		description: "일괄 삭제는 제한합니다.",
		fields: [],
		id: "ABT00000000000000000000023",
		inverted: true,
		name: "Cannot 접근 일괄 삭제",
		reason: "운영 안정성을 위해 제한",
		subject: {
			displayName: "일괄 삭제",
			fieldCount: 0,
			name: "BulkDelete",
		},
		updatedAt: new Date("2026-04-14T09:00:00.000Z"),
	},
];

const defaultSummary = {
	total: 3,
	filtered: 3,
	allow: 2,
	deny: 1,
	conditional: 1,
	fieldScoped: 1,
};

const defaultArgs: ComponentProps<typeof AbilityListScreen> = {
	abilities: abilityFixtures,
	actions: [
		{
			id: "ACT00000000000000000000097",
			label: "조회",
		},
		{
			id: "ACT00000000000000000000101",
			label: "수정",
		},
		{
			id: "ACT00000000000000000000105",
			label: "삭제",
		},
	],
	filters: {
		searchTerm: "",
		selectedActionId: "",
		selectedInverted: "",
		selectedSubjectId: "",
	},
	onChangeActionId: () => undefined,
	onChangeInverted: () => undefined,
	onChangeSearchTerm: () => undefined,
	onChangeSubjectId: () => undefined,
	onClickAbilityRow: () => undefined,
	onClickCreateButton: () => undefined,
	onClickResetFiltersButton: () => undefined,
	queryStates: {
		take: 10,
		skip: 0,
		search: "",
		subjectId: "",
		actionId: "",
		inverted: "",
	},
	setQueryStates: async () => new URLSearchParams(),
	summary: defaultSummary,
	subjects: [
		{
			id: "SBJ00000000000000000000136",
			label: "사용자",
		},
		{
			id: "SBJ00000000000000000000140",
			label: "예약",
		},
		{
			id: "SBJ00000000000000000000144",
			label: "일괄 삭제",
		},
	],
	totalCount: 3,
};
type AbilityListStoryItem = ComponentProps<
	typeof AbilityListScreen
>["abilities"][number];
type AbilityListStoryProps = ComponentProps<typeof AbilityListScreen>;
type AbilityListStoryState = AbilityListStoryProps & {
	allAbilities: AbilityListStoryItem[];
	lastAction: string;
	changeSearchTerm: (value: string) => void;
	changeSubjectId: (value: string) => void;
	changeActionId: (value: string) => void;
	changeInverted: (value: string) => void;
	resetFilters: () => void;
	selectAbility: (abilityId: string) => void;
	createAbility: () => void;
	setPageQuery: AbilityListStoryProps["setQueryStates"];
};
export const createAbilityListScreenStoryState = (
	initial: AbilityListStoryProps,
) => {
	let state: AbilityListStoryState;
	const applyAbilityListFilters = () => {
		const {
			searchTerm,
			selectedActionId,
			selectedInverted,
			selectedSubjectId,
		} = state.filters;
		const normalizedSearch = searchTerm.trim().toLowerCase();
		const filteredAbilities = state.allAbilities.filter((ability) => {
			const searchableText =
				`${ability.name} ${ability.description} ${ability.subject?.name ?? ""} ${ability.action?.name ?? ""}`.toLowerCase();
			return (
				(!normalizedSearch || searchableText.includes(normalizedSearch)) &&
				(!selectedSubjectId ||
					ability.subject?.name ===
						state.subjects.find((subject) => subject.id === selectedSubjectId)
							?.label) &&
				(!selectedActionId || ability.action?.id === selectedActionId) &&
				(!selectedInverted || String(ability.inverted) === selectedInverted)
			);
		});
		const take = Number(state.queryStates.take ?? 2);
		const pageStart = Number(state.queryStates.skip ?? 0);
		state.abilities = filteredAbilities.slice(pageStart, pageStart + take);
		state.totalCount = filteredAbilities.length;
		state.summary = {
			total: filteredAbilities.length,
			filtered: filteredAbilities.length,
			allow: filteredAbilities.filter((ability) => !ability.inverted).length,
			deny: filteredAbilities.filter((ability) => ability.inverted).length,
			conditional: filteredAbilities.filter((ability) =>
				Boolean(ability.conditions),
			).length,
			fieldScoped: filteredAbilities.filter(
				(ability) => ability.fields.length > 0,
			).length,
		};
	};
	state = makeAutoObservable(
		{
			...initial,
			allAbilities: [...initial.abilities],
			abilities: [...initial.abilities],
			filters: { ...initial.filters },
			queryStates: {
				...initial.queryStates,
				take: Math.min(Number(initial.queryStates.take ?? 10), 2),
			},
			lastAction: "",
			changeSearchTerm: (value: string) => {
				state.filters.searchTerm = value;
				state.queryStates.search = value;
				state.queryStates.skip = 0;
				applyAbilityListFilters();
			},
			changeSubjectId: (value: string) => {
				state.filters.selectedSubjectId = value;
				state.queryStates.subjectId = value;
				state.queryStates.skip = 0;
				applyAbilityListFilters();
			},
			changeActionId: (value: string) => {
				state.filters.selectedActionId = value;
				state.queryStates.actionId = value;
				state.queryStates.skip = 0;
				applyAbilityListFilters();
			},
			changeInverted: (value: string) => {
				state.filters.selectedInverted = value;
				state.queryStates.inverted = value;
				state.queryStates.skip = 0;
				applyAbilityListFilters();
			},
			resetFilters: () => {
				state.filters = {
					searchTerm: "",
					selectedActionId: "",
					selectedInverted: "",
					selectedSubjectId: "",
				};
				state.queryStates.search = "";
				state.queryStates.subjectId = "";
				state.queryStates.actionId = "";
				state.queryStates.inverted = "";
				state.queryStates.skip = 0;
				applyAbilityListFilters();
			},
			selectAbility: (abilityId: string) => {
				state.lastAction = `select:${abilityId}`;
			},
			createAbility: () => {
				state.lastAction = "create";
			},
			setPageQuery: async (values: Record<string, unknown | null>) => {
				state.queryStates.take = Number(values.take ?? state.queryStates.take);
				state.queryStates.skip = Number(values.skip ?? state.queryStates.skip);
				applyAbilityListFilters();
				return new URLSearchParams(
					Object.entries(values).map(([key, value]) => [
						key,
						String(value ?? ""),
					]),
				);
			},
		},
		{},
		{ autoBind: true, name: "AbilityListScreenStoryState" },
	) as unknown as AbilityListStoryState;
	applyAbilityListFilters();
	return state;
};

const filteredArgs = {
	...defaultArgs,
	abilities: [abilityFixtures[1]],
	filters: {
		searchTerm: "예약",
		selectedActionId: "ACT00000000000000000000101",
		selectedInverted: "false",
		selectedSubjectId: "SBJ00000000000000000000140",
	},
	queryStates: {
		take: 10,
		skip: 0,
		search: "예약",
		subjectId: "SBJ00000000000000000000140",
		actionId: "ACT00000000000000000000101",
		inverted: "false",
	},
	summary: {
		...defaultSummary,
		filtered: 1,
	},
	totalCount: 1,
};

const emptyStateArgs = {
	...defaultArgs,
	abilities: [],
	actions: [],
	summary: {
		total: 0,
		filtered: 0,
		allow: 0,
		deny: 0,
		conditional: 0,
		fieldScoped: 0,
	},
	subjects: [],
	totalCount: 0,
};

const meta = {
	title: "screen/AbilityListScreen",
	component: AbilityListScreen,
	excludeStories: [
		"createAbilityListScreenStoryState",
		"AbilityListScreenStoryHarness",
	],
	// Date 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		abilities: { control: false },
		subjects: { control: false },
		actions: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
	render: (args) => <AbilityListScreenStoryHarness args={args} />,
} satisfies Meta<typeof AbilityListScreen>;

export const AbilityListScreenStoryHarness = observer(
	function AbilityListScreenStoryHarness({
		args,
	}: {
		args: ComponentProps<typeof AbilityListScreen>;
	}) {
		const state = useLocalObservable(() =>
			createAbilityListScreenStoryState(args),
		);
		useStorybookState(
			() => ({
				filters: state.filters,
				queryStates: state.queryStates,
				lastAction: state.lastAction,
			}),
			"AbilityListScreen",
		);
		const {
			changeSearchTerm,
			changeSubjectId,
			changeActionId,
			changeInverted,
			resetFilters,
			selectAbility,
			createAbility,
			setPageQuery,
			allAbilities: _allAbilities,
			lastAction: _lastAction,
			...screenProps
		} = state;
		return (
			<AbilityListScreen
				{...screenProps}
				filters={state.filters}
				abilities={state.abilities}
				setQueryStates={setPageQuery}
				onChangeSearchTerm={changeSearchTerm}
				onChangeSubjectId={changeSubjectId}
				onChangeActionId={changeActionId}
				onChangeInverted={changeInverted}
				onClickResetFiltersButton={resetFilters}
				onClickAbilityRow={selectAbility}
				onClickCreateButton={createAbility}
			/>
		);
	},
);

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filtered: Story = {
	args: filteredArgs,
};

export const EmptyState: Story = {
	args: emptyStateArgs,
};

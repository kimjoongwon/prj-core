"use client";

import {
	type AbilityResponseDto,
	useGetAbilitiesSuspense,
} from "@cocrepo/api/core/abilities";
import { useGetActionsSuspense } from "@cocrepo/api/core/actions";
import { useGetSubjectsSuspense } from "@cocrepo/api/core/subjects";
import { DateTimeCell, Page, PageTitleBar, Section, VStack } from "@cocrepo/ui";
import { Button, Chip, Input, Select, SelectItem, Spinner } from "@heroui/react";
import { Key, Plus, Search } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, Suspense } from "react";

interface AbilityColumn {
	field: string;
	label: string;
	size: number;
	align?: "center";
	cell: (ability: AbilityResponseDto) => ReactNode;
}

const columns: AbilityColumn[] = [
	{
		field: "name",
		label: "권한 이름",
		size: 180,
		cell: (ability) => <span className="font-mono text-sm">{ability.name}</span>,
	},
	{
		field: "subject",
		label: "Subject",
		size: 150,
		cell: (ability) => (
			<span className="text-sm">
				{ability.subject?.displayName || ability.subject?.name || "-"}
			</span>
		),
	},
	{
		field: "action",
		label: "Action",
		size: 120,
		cell: (ability) => (
			<span className="text-sm">
				{ability.action?.displayName || ability.action?.name || "-"}
			</span>
		),
	},
	{
		field: "inverted",
		label: "유형",
		size: 100,
		align: "center",
		cell: (ability) => (
			<Chip
				size="sm"
				color={ability.inverted ? "danger" : "success"}
				variant="flat"
			>
				{ability.inverted ? "거부(cannot)" : "허용(can)"}
			</Chip>
		),
	},
	{
		field: "fields",
		label: "필드 수",
		size: 80,
		align: "center",
		cell: (ability) => (
			<span className="text-sm">
				{ability.fields.length === 0 ? "전체" : ability.fields.length}
			</span>
		),
	},
	{
		field: "conditions",
		label: "조건",
		size: 80,
		align: "center",
		cell: (ability) => (
			<Chip
				size="sm"
				color={ability.conditions ? "primary" : "default"}
				variant="flat"
			>
				{ability.conditions ? "있음" : "없음"}
			</Chip>
		),
	},
	{
		field: "createdAt",
		label: "생성일",
		size: 150,
		cell: (ability) => <DateTimeCell value={ability.createdAt} />,
	},
];

const AbilitiesPageContent = observer(function AbilitiesPageContent({
	searchTerm,
	selectedSubjectId,
	selectedActionId,
	selectedInverted,
	onChangeSearchTerm,
	onChangeSelectedSubjectId,
	onChangeSelectedActionId,
	onChangeSelectedInverted,
	onClickResetFilters,
	onClickRow,
}: {
	searchTerm: string;
	selectedSubjectId: string;
	selectedActionId: string;
	selectedInverted: string;
	onChangeSearchTerm: (value: string) => void;
	onChangeSelectedSubjectId: (value: string) => void;
	onChangeSelectedActionId: (value: string) => void;
	onChangeSelectedInverted: (value: string) => void;
	onClickResetFilters: () => void;
	onClickRow: (abilityId: string) => void;
}) {
	const { data: response } = useGetAbilitiesSuspense();
	const { data: subjectsResponse } = useGetSubjectsSuspense();
	const { data: actionsResponse } = useGetActionsSuspense();

	const abilities = response?.data ?? [];
	const subjects = subjectsResponse?.data ?? [];
	const actions = actionsResponse?.data ?? [];

	const filteredAbilities = abilities.filter((ability) => {
		if (
			searchTerm &&
			!ability.name.toLowerCase().includes(searchTerm.toLowerCase())
		) {
			return false;
		}

		if (selectedSubjectId && ability.subjectId !== selectedSubjectId) {
			return false;
		}

		if (selectedActionId && ability.actionId !== selectedActionId) {
			return false;
		}

		if (selectedInverted !== "") {
			const invertedBool = selectedInverted === "true";
			if (ability.inverted !== invertedBool) {
				return false;
			}
		}

		return true;
	});

	return (
		<VStack gap={4}>
			<Section top={<PageTitleBar level={2} title="필터" />}>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
					<Input
						placeholder="권한 이름 검색"
						value={searchTerm}
						onValueChange={onChangeSearchTerm}
						startContent={<Search className="h-4 w-4 text-default-400" />}
						isClearable
						onClear={() => onChangeSearchTerm("")}
					/>
					<Select
						placeholder="Subject 선택"
						selectedKeys={selectedSubjectId ? [selectedSubjectId] : []}
						onSelectionChange={(keys) => {
							const selected = Array.from(keys)[0] as string;
							onChangeSelectedSubjectId(selected || "");
						}}
					>
						{subjects.map((subject) => (
							<SelectItem key={subject.id}>
								{subject.displayName || subject.name}
							</SelectItem>
						))}
					</Select>
					<Select
						placeholder="Action 선택"
						selectedKeys={selectedActionId ? [selectedActionId] : []}
						onSelectionChange={(keys) => {
							const selected = Array.from(keys)[0] as string;
							onChangeSelectedActionId(selected || "");
						}}
					>
						{actions.map((action) => (
							<SelectItem key={action.id}>
								{action.displayName || action.name}
							</SelectItem>
						))}
					</Select>
					<Select
						placeholder="유형 선택"
						selectedKeys={selectedInverted ? [selectedInverted] : []}
						onSelectionChange={(keys) => {
							const selected = Array.from(keys)[0] as string;
							onChangeSelectedInverted(selected || "");
						}}
					>
						<SelectItem key="false">허용(can)</SelectItem>
						<SelectItem key="true">거부(cannot)</SelectItem>
					</Select>
				</div>
				<div className="mt-2 flex justify-end">
					<Button size="sm" variant="flat" onPress={onClickResetFilters}>
						필터 초기화
					</Button>
				</div>
			</Section>
			<Section top={<PageTitleBar level={2} title="권한 목록" />}>
				{filteredAbilities.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-4 p-16">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
							<Key className="h-8 w-8 text-primary" />
						</div>
						<p className="text-default-500">
							{abilities.length === 0
								? "등록된 권한이 없습니다."
								: "검색 조건에 맞는 권한이 없습니다."}
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-divider">
									{columns.map((column) => (
										<th
											key={column.field}
											className={`px-4 py-3 text-left font-medium text-default-500 ${column.align === "center" ? "text-center" : ""}`}
											style={{ width: column.size }}
										>
											{column.label}
										</th>
									))}
									<th className="w-[100px] px-4 py-3 text-center font-medium text-default-500">
										액션
									</th>
								</tr>
							</thead>
							<tbody>
								{filteredAbilities.map((ability) => (
									<tr
										key={ability.id}
										className="cursor-pointer border-b border-divider transition-colors hover:bg-content2/50"
										onClick={() => onClickRow(ability.id)}
									>
										{columns.map((column) => (
											<td
												key={column.field}
												className={`px-4 py-3 ${column.align === "center" ? "text-center" : ""}`}
											>
												{column.cell(ability)}
											</td>
										))}
										<td className="px-4 py-3 text-center">
											<Button
												as={Link}
												href={`/abilities/${ability.id}` as Route}
												size="sm"
												variant="flat"
												onClick={(event) => event.stopPropagation()}
											>
												상세
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className="px-4 py-3 text-sm text-default-500">
							총 {filteredAbilities.length}건
						</div>
					</div>
				)}
			</Section>
		</VStack>
	);
});

const AbilitiesPageFallback = observer(function AbilitiesPageFallback() {
	return (
		<VStack gap={4}>
			<Section top={<PageTitleBar level={2} title="필터" />}>
				<div className="flex items-center justify-center gap-2 p-8">
					<Spinner size="sm" />
					<span className="text-default-500">로딩 중...</span>
				</div>
			</Section>
			<Section top={<PageTitleBar level={2} title="권한 목록" />}>
				<div className="flex items-center justify-center gap-2 p-8">
					<Spinner size="sm" />
					<span className="text-default-500">로딩 중...</span>
				</div>
			</Section>
		</VStack>
	);
});

const AbilitiesPage = observer(function AbilitiesPage() {
	const router = useRouter();
	const state = useLocalObservable(() => ({
		searchTerm: "",
		selectedSubjectId: "",
		selectedActionId: "",
		selectedInverted: "",
	}));

	const onClickRow = (abilityId: string) => {
		router.push(`/abilities/${abilityId}` as Route);
	};

	const onClickResetFilters = () => {
		state.searchTerm = "";
		state.selectedSubjectId = "";
		state.selectedActionId = "";
		state.selectedInverted = "";
	};

	return (
		<Page
			top={
				<PageTitleBar
					title="권한 목록"
					description="시스템에 등록된 CASL 권한을 관리합니다."
					actions={
						<Button
							as={Link}
							href="/abilities/new"
							color="primary"
							startContent={<Plus className="h-4 w-4" />}
						>
							권한 추가
						</Button>
					}
				/>
			}
		>
			<Suspense fallback={<AbilitiesPageFallback />}>
				<AbilitiesPageContent
					searchTerm={state.searchTerm}
					selectedSubjectId={state.selectedSubjectId}
					selectedActionId={state.selectedActionId}
					selectedInverted={state.selectedInverted}
					onChangeSearchTerm={(value) => {
						state.searchTerm = value;
					}}
					onChangeSelectedSubjectId={(value) => {
						state.selectedSubjectId = value;
					}}
					onChangeSelectedActionId={(value) => {
						state.selectedActionId = value;
					}}
					onChangeSelectedInverted={(value) => {
						state.selectedInverted = value;
					}}
					onClickResetFilters={onClickResetFilters}
					onClickRow={onClickRow}
				/>
			</Suspense>
		</Page>
	);
});

export default AbilitiesPage;

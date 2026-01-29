"use client";

import {
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Tab,
	Tabs,
} from "@heroui/react";
import { Database, Key, Link2, Server } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

import { MermaidChart } from "../../components/MermaidChart";
import type {
	EntityFieldView,
	EntityView,
	FieldConstraint,
	FieldType,
} from "../../components/requirements/types";
import { useRequirementGraph } from "../../hooks/useRequirementGraph";
import {
	extractEntities,
	generateMermaidERD,
	getNodeNames,
} from "../../lib/graph-extractors";

const FIELD_TYPE_COLORS: Record<FieldType, "default" | "primary" | "secondary" | "success" | "warning" | "danger"> = {
	String: "default",
	Int: "primary",
	Float: "primary",
	Boolean: "success",
	DateTime: "secondary",
	Json: "warning",
	Enum: "danger",
	UUID: "primary",
};

const CONSTRAINT_LABELS: Record<FieldConstraint, string> = {
	pk: "PK",
	fk: "FK",
	unique: "UQ",
	required: "REQ",
	optional: "OPT",
	default: "DEF",
	autoIncrement: "AI",
	index: "IDX",
};

/**
 * DB 설계 페이지 클라이언트 컴포넌트
 */
export const DatabasePageClient = observer(() => {
	const { graph, isLoading, error } = useRequirementGraph();
	const [selectedTab, setSelectedTab] = useState<"list" | "erd">("list");

	const entities = useMemo(
		() => (graph ? extractEntities(graph) : []),
		[graph],
	);

	const mermaidERD = useMemo(
		() => (entities.length > 0 ? generateMermaidERD(entities) : ""),
		[entities],
	);

	// 통계
	const totalFields = useMemo(
		() => entities.reduce((sum, e) => sum + e.fields.length, 0),
		[entities],
	);

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<p className="text-default-500">Entity 데이터 로딩 중...</p>
			</div>
		);
	}

	if (error || !graph) {
		return (
			<div className="flex h-64 items-center justify-center">
				<p className="text-danger">데이터를 불러올 수 없습니다.</p>
			</div>
		);
	}

	return (
		<div className="py-8">
			{/* 헤더 */}
			<div className="mb-8">
				<h2 className="text-2xl font-bold text-default-800">DB 설계</h2>
				<p className="mt-1 text-sm text-default-500">
					요구사항 그래프의 Entity(L7) 노드를 기반으로 생성된 데이터베이스
					스키마입니다
				</p>
			</div>

			{/* 통계 카드 */}
			<div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
				<StatCard
					icon={<Database className="size-5" />}
					label="Entity"
					count={entities.length}
				/>
				<StatCard
					icon={<Key className="size-5" />}
					label="총 필드"
					count={totalFields}
				/>
				<StatCard
					icon={<Link2 className="size-5" />}
					label="관계"
					count={entities.reduce(
						(sum, e) => sum + e.references.length + e.referencedBy.length,
						0,
					)}
				/>
				<StatCard
					icon={<Server className="size-5" />}
					label="연결 API"
					count={entities.reduce((sum, e) => sum + e.usedByApis.length, 0)}
				/>
			</div>

			{/* 뷰 전환 탭 */}
			<Tabs
				aria-label="DB 설계 뷰"
				selectedKey={selectedTab}
				onSelectionChange={(key) => setSelectedTab(key as "list" | "erd")}
				color="primary"
				variant="underlined"
				classNames={{
					tabList: "gap-4",
					tab: "px-2 h-10",
				}}
			>
				<Tab key="list" title="Entity 목록" />
				<Tab key="erd" title="ERD 다이어그램" />
			</Tabs>

			{/* 컨텐츠 */}
			<div className="mt-6">
				{selectedTab === "list" ? (
					<div className="space-y-4">
						{entities.length === 0 ? (
							<div className="flex h-32 items-center justify-center text-default-500">
								<Database className="mr-2 size-5" />
								Entity가 없습니다
							</div>
						) : (
							entities.map((entity) => (
								<EntityCard key={entity.id} entity={entity} graph={graph} />
							))
						)}
					</div>
				) : (
					<Card className="bg-content1 shadow-sm">
						<CardHeader>
							<h3 className="text-lg font-semibold">Entity Relationship Diagram</h3>
						</CardHeader>
						<Divider />
						<CardBody>
							{mermaidERD ? (
								<MermaidChart chart={mermaidERD} className="min-h-[400px]" />
							) : (
								<p className="text-center text-default-500">
									ERD를 생성할 Entity가 없습니다
								</p>
							)}
						</CardBody>
					</Card>
				)}
			</div>
		</div>
	);
});

/**
 * 통계 카드 컴포넌트
 */
function StatCard({
	icon,
	label,
	count,
}: {
	icon: React.ReactNode;
	label: string;
	count: number;
}) {
	return (
		<Card className="bg-content1 shadow-sm">
			<CardBody className="flex flex-row items-center gap-3 py-3">
				<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
					{icon}
				</div>
				<div>
					<p className="text-2xl font-bold">{count}</p>
					<p className="text-xs text-default-500">{label}</p>
				</div>
			</CardBody>
		</Card>
	);
}

/**
 * Entity 카드 컴포넌트
 */
const EntityCard = observer(
	({
		entity,
		graph,
	}: {
		entity: EntityView;
		graph: import("../../components/requirements/types").RequirementGraph;
	}) => {
		const referenceNames = getNodeNames(graph, entity.references);
		const referencedByNames = getNodeNames(graph, entity.referencedBy);
		const apiNames = getNodeNames(graph, entity.usedByApis);

		return (
			<Card className="bg-content1 shadow-sm">
				<CardHeader className="flex items-start justify-between gap-4 pb-2">
					<div className="flex items-center gap-3">
						<div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
							<Database className="size-5" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-default-800">
								{entity.name}
							</h3>
							<p className="text-xs text-default-400">{entity.id}</p>
						</div>
					</div>
					<Chip size="sm" variant="flat">
						{entity.fields.length}개 필드
					</Chip>
				</CardHeader>
				<CardBody className="pt-0">
					<p className="mb-4 text-sm text-default-600">{entity.description}</p>

					{/* 필드 테이블 */}
					<div className="mb-4 overflow-x-auto rounded-lg border border-divider">
						<table className="w-full text-sm">
							<thead className="bg-content2">
								<tr>
									<th className="px-3 py-2 text-left text-xs font-semibold text-default-500">
										필드명
									</th>
									<th className="px-3 py-2 text-left text-xs font-semibold text-default-500">
										타입
									</th>
									<th className="px-3 py-2 text-left text-xs font-semibold text-default-500">
										제약조건
									</th>
									<th className="px-3 py-2 text-left text-xs font-semibold text-default-500">
										설명
									</th>
								</tr>
							</thead>
							<tbody>
								{entity.fields.map((field) => (
									<FieldRow key={field.id} field={field} />
								))}
							</tbody>
						</table>
					</div>

					{/* 관계 정보 */}
					<div className="grid gap-4 md:grid-cols-3">
						{/* 참조하는 Entity */}
						<div className="rounded-lg bg-content2 p-3">
							<div className="mb-2 flex items-center gap-2 text-xs font-semibold text-default-500">
								<Link2 className="size-3" />
								참조 (FK →)
							</div>
							{referenceNames.length > 0 ? (
								<div className="flex flex-wrap gap-1">
									{referenceNames.map((name) => (
										<Chip key={name} size="sm" variant="flat" color="secondary">
											{name}
										</Chip>
									))}
								</div>
							) : (
								<span className="text-xs text-default-400">없음</span>
							)}
						</div>

						{/* 참조되는 Entity */}
						<div className="rounded-lg bg-content2 p-3">
							<div className="mb-2 flex items-center gap-2 text-xs font-semibold text-default-500">
								<Link2 className="size-3" />
								역참조 (← FK)
							</div>
							{referencedByNames.length > 0 ? (
								<div className="flex flex-wrap gap-1">
									{referencedByNames.map((name) => (
										<Chip key={name} size="sm" variant="flat" color="warning">
											{name}
										</Chip>
									))}
								</div>
							) : (
								<span className="text-xs text-default-400">없음</span>
							)}
						</div>

						{/* 사용 API */}
						<div className="rounded-lg bg-content2 p-3">
							<div className="mb-2 flex items-center gap-2 text-xs font-semibold text-default-500">
								<Server className="size-3" />
								사용 API
							</div>
							{apiNames.length > 0 ? (
								<div className="flex flex-wrap gap-1">
									{apiNames.map((name) => (
										<Chip key={name} size="sm" variant="flat" color="primary">
											{name}
										</Chip>
									))}
								</div>
							) : (
								<span className="text-xs text-default-400">없음</span>
							)}
						</div>
					</div>
				</CardBody>
			</Card>
		);
	},
);

/**
 * 필드 테이블 행 컴포넌트
 */
function FieldRow({ field }: { field: EntityFieldView }) {
	const isPK = field.constraints.includes("pk");
	const isFK = field.constraints.includes("fk");

	return (
		<tr className="border-t border-divider">
			<td className="px-3 py-2">
				<div className="flex items-center gap-2">
					{isPK && (
						<Key className="size-3 text-warning" title="Primary Key" />
					)}
					{isFK && (
						<Link2 className="size-3 text-secondary" title="Foreign Key" />
					)}
					<code className="font-mono text-xs">{field.name}</code>
				</div>
			</td>
			<td className="px-3 py-2">
				<Chip
					size="sm"
					variant="flat"
					color={FIELD_TYPE_COLORS[field.fieldType]}
				>
					{field.fieldType}
				</Chip>
			</td>
			<td className="px-3 py-2">
				<div className="flex flex-wrap gap-1">
					{field.constraints.map((c) => (
						<span
							key={c}
							className="rounded bg-default-100 px-1.5 py-0.5 text-xs text-default-600"
						>
							{CONSTRAINT_LABELS[c]}
						</span>
					))}
				</div>
			</td>
			<td className="px-3 py-2 text-xs text-default-500">
				{field.description}
			</td>
		</tr>
	);
}

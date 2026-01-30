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
import { Database, FileJson, Monitor, Server } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

import type { ApiView, HttpMethod } from "../../components/requirements/types";
import { useRequirementGraph } from "../../hooks/useRequirementGraph";
import {
	extractApis,
	getNodeNames,
	groupApisByMethod,
} from "../../lib/graph-extractors";

const METHOD_COLORS: Record<
	HttpMethod,
	"success" | "primary" | "warning" | "secondary" | "danger"
> = {
	GET: "success",
	POST: "primary",
	PUT: "warning",
	PATCH: "secondary",
	DELETE: "danger",
};

/**
 * API 설계 페이지 클라이언트 컴포넌트
 */
export const ApiPageClient = observer(() => {
	const { graph, isLoading, error } = useRequirementGraph();
	const [selectedMethod, setSelectedMethod] = useState<HttpMethod | "ALL">(
		"ALL",
	);

	const apis = useMemo(() => (graph ? extractApis(graph) : []), [graph]);
	const groupedApis = useMemo(() => groupApisByMethod(apis), [apis]);

	const filteredApis =
		selectedMethod === "ALL" ? apis : groupedApis[selectedMethod];

	// 통계
	const stats = useMemo(() => {
		const counts: Record<HttpMethod, number> = {
			GET: groupedApis.GET.length,
			POST: groupedApis.POST.length,
			PUT: groupedApis.PUT.length,
			PATCH: groupedApis.PATCH.length,
			DELETE: groupedApis.DELETE.length,
		};
		return counts;
	}, [groupedApis]);

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<p className="text-default-500">API 데이터 로딩 중...</p>
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
				<h2 className="text-2xl font-bold text-default-800">API 설계</h2>
				<p className="mt-1 text-sm text-default-500">
					요구사항 그래프의 API(L6) 노드를 기반으로 생성된 API 명세입니다
				</p>
			</div>

			{/* 통계 카드 */}
			<div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
				<StatCard label="전체" count={apis.length} color="default" />
				<StatCard label="GET" count={stats.GET} color="success" />
				<StatCard label="POST" count={stats.POST} color="primary" />
				<StatCard label="PUT" count={stats.PUT} color="warning" />
				<StatCard label="PATCH" count={stats.PATCH} color="secondary" />
				<StatCard label="DELETE" count={stats.DELETE} color="danger" />
			</div>

			{/* 메서드 필터 탭 */}
			<Tabs
				aria-label="API 메서드 필터"
				selectedKey={selectedMethod}
				onSelectionChange={(key) =>
					setSelectedMethod(key as HttpMethod | "ALL")
				}
				color="primary"
				variant="underlined"
				classNames={{
					tabList: "gap-4",
					tab: "px-2 h-10",
				}}
			>
				<Tab key="ALL" title="전체" />
				<Tab key="GET" title="GET" />
				<Tab key="POST" title="POST" />
				<Tab key="PUT" title="PUT" />
				<Tab key="PATCH" title="PATCH" />
				<Tab key="DELETE" title="DELETE" />
			</Tabs>

			{/* API 목록 */}
			<div className="mt-6 space-y-4">
				{filteredApis.length === 0 ? (
					<div className="flex h-32 items-center justify-center text-default-500">
						<Server className="mr-2 size-5" />
						해당 메서드의 API가 없습니다
					</div>
				) : (
					filteredApis.map((api) => (
						<ApiCard key={api.id} api={api} graph={graph} />
					))
				)}
			</div>
		</div>
	);
});

/**
 * 통계 카드 컴포넌트
 */
function StatCard({
	label,
	count,
	color,
}: {
	label: string;
	count: number;
	color: "default" | "success" | "primary" | "warning" | "secondary" | "danger";
}) {
	return (
		<Card className="bg-content1 shadow-sm">
			<CardBody className="py-3 text-center">
				<p className={`text-2xl font-bold text-${color}`}>{count}</p>
				<p className="text-xs text-default-500">{label}</p>
			</CardBody>
		</Card>
	);
}

/**
 * API 카드 컴포넌트
 */
const ApiCard = observer(
	({
		api,
		graph,
	}: {
		api: ApiView;
		graph: import("../../components/requirements/types").RequirementGraph;
	}) => {
		const screenNames = getNodeNames(graph, api.calledByScreens);
		const entityNames = getNodeNames(graph, api.usesEntities);

		return (
			<Card className="bg-content1 shadow-sm">
				<CardHeader className="flex items-start justify-between gap-4 pb-2">
					<div className="flex items-center gap-3">
						<Chip
							color={METHOD_COLORS[api.method]}
							variant="flat"
							size="sm"
							className="font-mono font-semibold"
						>
							{api.method}
						</Chip>
						<code className="text-sm font-medium text-default-700">
							{api.endpoint}
						</code>
					</div>
					<span className="text-xs text-default-400">{api.id}</span>
				</CardHeader>
				<CardBody className="pt-0">
					<p className="mb-4 text-sm text-default-600">{api.description}</p>

					<div className="grid gap-4 md:grid-cols-2">
						{/* 호출 화면 */}
						<div className="rounded-lg bg-content2 p-3">
							<div className="mb-2 flex items-center gap-2 text-xs font-semibold text-default-500">
								<Monitor className="size-3" />
								호출 화면
							</div>
							{screenNames.length > 0 ? (
								<div className="flex flex-wrap gap-1">
									{screenNames.map((name) => (
										<Chip key={name} size="sm" variant="flat">
											{name}
										</Chip>
									))}
								</div>
							) : (
								<span className="text-xs text-default-400">
									연결된 화면 없음
								</span>
							)}
						</div>

						{/* 연결 Entity */}
						<div className="rounded-lg bg-content2 p-3">
							<div className="mb-2 flex items-center gap-2 text-xs font-semibold text-default-500">
								<Database className="size-3" />
								연결 Entity
							</div>
							{entityNames.length > 0 ? (
								<div className="flex flex-wrap gap-1">
									{entityNames.map((name) => (
										<Chip key={name} size="sm" variant="flat" color="secondary">
											{name}
										</Chip>
									))}
								</div>
							) : (
								<span className="text-xs text-default-400">
									연결된 Entity 없음
								</span>
							)}
						</div>
					</div>

					{/* 메타데이터 상세 (확장 가능) */}
					{api.metadata.queryParams && api.metadata.queryParams.length > 0 && (
						<>
							<Divider className="my-4" />
							<div className="rounded-lg bg-content2 p-3">
								<div className="mb-2 flex items-center gap-2 text-xs font-semibold text-default-500">
									<FileJson className="size-3" />
									Query Parameters
								</div>
								<div className="flex flex-wrap gap-1">
									{api.metadata.queryParams.map((param) => (
										<Chip key={param.name} size="sm" variant="bordered">
											{param.name}
											{param.required && (
												<span className="ml-1 text-danger">*</span>
											)}
										</Chip>
									))}
								</div>
							</div>
						</>
					)}

					{/* 인증 정보 */}
					{api.metadata.auth && (
						<div className="mt-3 flex items-center gap-2 text-xs text-default-400">
							<span>🔐</span>
							<span>{api.metadata.auth}</span>
						</div>
					)}
				</CardBody>
			</Card>
		);
	},
);

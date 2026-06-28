"use client";

import type { DataGridConfig, DataGridQueryStates } from "@cocrepo/type";
import {
	Activity,
	AlertTriangle,
	CheckCircle2,
	Database,
	Layers3,
	Palette,
	PanelTop,
	Search,
	ShieldCheck,
	Table2,
	Users,
} from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Badge } from "../../data-display/Badge/Badge";
import { Chip } from "../../data-display/Chip/Chip";
import { Table } from "../../data-display/Table/Table";
import { DataGrid, type Key } from "../../data-grid/DataGrid";
import { DataGridStateModel } from "../../data-grid/DataGridState";
import { Alert, Skeleton, Spinner } from "../../feedback";
import { Input } from "../../input/Input/Input";
import { Section } from "../../layout";
import { VStack } from "../../rhythm";
import { ScreenSurface, SectionSurface, Surface } from "../../surface";
import { PageTitleBar, StatsCard } from "../../widget";

export type DesignSystemTabId =
	| "overview"
	| "foundations"
	| "components"
	| "patterns"
	| "audit";

export interface DesignSystemScreenProps {
	activeTab?: DesignSystemTabId;
	onChangeTab?: (tabId: DesignSystemTabId) => void;
}

interface DesignSystemGridRow {
	id: Key;
	component: string;
	layer: string;
	owner: string;
	risk: string;
}

interface DesignSystemAuditRow {
	id: string;
	target: string;
	current: string;
	decision: string;
	priority: string;
}

export const DESIGN_SYSTEM_TAB_QUERY_KEY = "ds-tab";
export const DEFAULT_DESIGN_SYSTEM_TAB: DesignSystemTabId = "overview";

export const designSystemTabs: Array<{
	id: DesignSystemTabId;
	label: string;
	summary: string;
}> = [
	{
		id: "overview",
		label: "Overview",
		summary: "screen rhythm",
	},
	{
		id: "foundations",
		label: "Foundations",
		summary: "surface, type, color",
	},
	{
		id: "components",
		label: "Components",
		summary: "admin primitives",
	},
	{
		id: "patterns",
		label: "Patterns",
		summary: "page composition",
	},
	{
		id: "audit",
		label: "Audit",
		summary: "current overrides",
	},
];

const designSystemTabIds = designSystemTabs.map(({ id }) => id);

export function isDesignSystemTabId(
	value: unknown,
): value is DesignSystemTabId {
	return (
		typeof value === "string" &&
		designSystemTabIds.includes(value as DesignSystemTabId)
	);
}

const designSystemGridRows: DesignSystemGridRow[] = [
	{
		id: "screen-surface",
		component: "ScreenSurface",
		layer: "screen boundary",
		owner: "screen",
		risk: "baseline",
	},
	{
		id: "layout-section",
		component: "layout/Section",
		layer: "major section",
		owner: "screen",
		risk: "spacing drift",
	},
	{
		id: "stats-card",
		component: "StatsCard",
		layer: "metric widget",
		owner: "widget",
		risk: "background override",
	},
	{
		id: "data-grid",
		component: "DataGrid",
		layer: "dense data",
		owner: "data-grid",
		risk: "toolbar density",
	},
	{
		id: "feedback",
		component: "Alert / Skeleton / Spinner",
		layer: "feedback",
		owner: "feedback",
		risk: "state emphasis",
	},
];

const designSystemGridConfig: DataGridConfig<DesignSystemGridRow> = {
	entity: "DesignSystemComponent",
	columns: [
		{ field: "component", label: "Component" },
		{ field: "layer", label: "Layer" },
		{ field: "owner", label: "Owner" },
		{ field: "risk", label: "Risk" },
	],
	emptyMessage: "표시할 컴포넌트가 없습니다.",
};

const designSystemAuditRows: DesignSystemAuditRow[] = [
	{
		id: "user-list-background",
		target: "UserListScreen background",
		current: "screen 내부에서 bg-surface, bg-background가 직접 섞임",
		decision:
			"ScreenSurface, SectionSurface, layout/Section 순서로 표면과 구조를 분리",
		priority: "P1",
	},
	{
		id: "metric-density",
		target: "StatsCard rhythm",
		current: "메트릭 카드가 리스트/필터 표면과 같은 강도로 보임",
		decision: "metric은 상단 summary rail로 고정하고 section과 분리",
		priority: "P1",
	},
	{
		id: "filter-toolbar",
		target: "Filter toolbar",
		current: "검색, 상태 chip, primary action 간격이 화면마다 다름",
		decision: "toolbar는 입력 1열, action cluster 1열 구조로 고정",
		priority: "P2",
	},
	{
		id: "nested-panel",
		target: "Nested panel",
		current: "카드 안 카드처럼 보이는 local Surface가 반복됨",
		decision: "반복 item만 card, section 내부 보조 영역은 border row 사용",
		priority: "P2",
	},
];

const designSystemSurfaceRows = [
	{
		id: "route",
		name: "Route canvas",
		token: "bg-background",
		usage: "앱 chrome 뒤쪽의 가장 바깥 배경",
	},
	{
		id: "screen",
		name: "ScreenSurface",
		token: "variant=default",
		usage: "Screen public boundary, 페이지 본문 전체",
	},
	{
		id: "section",
		name: "SectionSurface + layout/Section",
		token: "variant=secondary + inset=section",
		usage: "제목과 본문을 가진 주요 정보 구획",
	},
	{
		id: "local",
		name: "Surface",
		token: "variant=secondary",
		usage: "위젯 내부의 짧은 보조 패널",
	},
];

const designSystemPatternRows = [
	{
		id: "list",
		title: "List screen",
		description:
			"PageTitleBar, metric rail, filter toolbar, DataGrid 순서로 흐릅니다.",
	},
	{
		id: "detail",
		title: "Detail screen",
		description:
			"상태 summary, 읽기 전용 profile block, editable relation section을 분리합니다.",
	},
	{
		id: "form",
		title: "Form screen",
		description:
			"필수 입력, 위험 액션, 저장 액션을 같은 표면 안에서 경쟁시키지 않습니다.",
	},
];

export const DesignSystemScreen = observer(
	({ activeTab, onChangeTab }: DesignSystemScreenProps) => {
		const currentTab = isDesignSystemTabId(activeTab)
			? activeTab
			: DEFAULT_DESIGN_SYSTEM_TAB;
		const gridQueryStates = useLocalObservable(
			() =>
				({
					search: "",
					skip: 0,
					take: 10,
				}) as DataGridQueryStates,
		);
		const gridState = useLocalObservable(
			() =>
				new DataGridStateModel({
					queryStates: gridQueryStates,
					setQueryStates: async (values) => {
						for (const [key, value] of Object.entries(values)) {
							if (value === null) {
								delete gridQueryStates[key];
							} else {
								gridQueryStates[key] = value;
							}
						}

						return new URLSearchParams();
					},
				}),
		);

		return (
			<div className="min-h-screen bg-background p-4 text-foreground md:p-6">
				<ScreenSurface className="mx-auto max-w-[1440px] p-4 md:p-6">
					<VStack gap="page" fullWidth>
						<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
							<PageTitleBar
								title="DesignSystemScreen"
								description="web/admin 화면을 고치기 전에 현재 표면, 밀도, 상태, 데이터 표시 리듬을 한 곳에서 확인합니다."
								actions={
									<div className="flex flex-wrap justify-end gap-2">
										<Chip color="primary" variant="flat">
											Storybook only
										</Chip>
										<Chip color="success" variant="flat">
											MSW baseline
										</Chip>
									</div>
								}
							/>
							<div className="grid grid-cols-2 gap-3">
								<div className="rounded-lg border border-border bg-background px-4 py-3">
									<p className="text-xs font-semibold uppercase text-muted">
										Screens
									</p>
									<p className="mt-1 text-2xl font-bold">2</p>
									<p className="mt-1 text-xs text-muted">web, mobile</p>
								</div>
								<div className="rounded-lg border border-border bg-background px-4 py-3">
									<p className="text-xs font-semibold uppercase text-muted">
										Layers
									</p>
									<p className="mt-1 text-2xl font-bold">4</p>
									<p className="mt-1 text-xs text-muted">surface stack</p>
								</div>
								<div className="rounded-lg border border-border bg-background px-4 py-3">
									<p className="text-xs font-semibold uppercase text-muted">
										Inventory
									</p>
									<p className="mt-1 text-2xl font-bold">18</p>
									<p className="mt-1 text-xs text-muted">admin primitives</p>
								</div>
								<div className="rounded-lg border border-border bg-background px-4 py-3">
									<p className="text-xs font-semibold uppercase text-muted">
										Risks
									</p>
									<p className="mt-1 text-2xl font-bold">4</p>
									<p className="mt-1 text-xs text-muted">override targets</p>
								</div>
							</div>
						</div>

						<div
							aria-label="Design system sections"
							className="grid gap-2 rounded-lg border border-border bg-background p-2 md:grid-cols-5"
							role="tablist"
						>
							{designSystemTabs.map((tab) => {
								const isSelected = tab.id === currentTab;

								return (
									<button
										aria-controls={`design-system-panel-${tab.id}`}
										aria-selected={isSelected}
										className={`flex min-h-12 justify-start rounded-lg px-3 py-2 text-left transition-colors ${
											isSelected
												? "bg-accent text-accent-foreground"
												: "text-foreground hover:bg-surface-secondary"
										}`}
										id={`design-system-tab-${tab.id}`}
										key={tab.id}
										onClick={() => onChangeTab?.(tab.id)}
										role="tab"
										type="button"
									>
										<span className="flex min-w-0 flex-col items-start">
											<span className="text-sm font-semibold">{tab.label}</span>
											<span
												className={`text-xs ${
													isSelected
														? "text-accent-foreground/75"
														: "text-muted"
												}`}
											>
												{tab.summary}
											</span>
										</span>
									</button>
								);
							})}
						</div>

						{currentTab === "overview" ? (
							<div
								aria-labelledby="design-system-tab-overview"
								id="design-system-panel-overview"
								role="tabpanel"
							>
								<VStack gap="section" fullWidth>
									<div className="grid gap-4 lg:grid-cols-3">
										<StatsCard
											className="h-full"
											color="primary"
											description="screen-level metric card"
											icon={<Users className="size-5" />}
											title="전체 이용자"
											value={1280}
										/>
										<StatsCard
											className="h-full"
											color="success"
											description="status-specific metric card"
											icon={<ShieldCheck className="size-5" />}
											title="활성 이용자"
											value={1184}
										/>
										<StatsCard
											className="h-full"
											color="default"
											description="neutral metric card"
											icon={<Activity className="size-5" />}
											title="최근 활동"
											value="오늘 42건"
										/>
									</div>

									<SectionSurface>
										<Section>
											<Section.Header>
												<PageTitleBar
													level={2}
													title="Admin Screen Map"
													description="현재 admin 화면을 안정적으로 만들기 위한 기본 구획 순서입니다."
												/>
											</Section.Header>
											<Section.Body>
												<div className="grid gap-3 lg:grid-cols-4">
													{[
														{
															icon: <PanelTop className="size-5" />,
															title: "Title bar",
															body: "페이지 의도, 상태 chip, 주요 액션",
														},
														{
															icon: <Layers3 className="size-5" />,
															title: "Metric rail",
															body: "요약 수치와 상태 변화",
														},
														{
															icon: <Search className="size-5" />,
															title: "Toolbar",
															body: "검색, 필터, 보조 액션",
														},
														{
															icon: <Table2 className="size-5" />,
															title: "Data area",
															body: "DataGrid, Table, 빈 상태",
														},
													].map((item) => (
														<div
															className="rounded-lg border border-border bg-background p-4"
															key={item.title}
														>
															<div className="flex items-center gap-3">
																<div className="flex size-9 items-center justify-center rounded-lg bg-surface-secondary text-accent">
																	{item.icon}
																</div>
																<p className="text-sm font-semibold">
																	{item.title}
																</p>
															</div>
															<p className="mt-3 text-sm leading-5 text-muted">
																{item.body}
															</p>
														</div>
													))}
												</div>
											</Section.Body>
										</Section>
									</SectionSurface>
								</VStack>
							</div>
						) : null}

						{currentTab === "foundations" ? (
							<div
								aria-labelledby="design-system-tab-foundations"
								id="design-system-panel-foundations"
								role="tabpanel"
							>
								<VStack gap="section" fullWidth>
									<SectionSurface>
										<Section>
											<Section.Header>
												<PageTitleBar
													level={2}
													title="Surface Hierarchy"
													description="화면 배경 위계를 한 줄로 비교합니다. 이후 admin 리듬 수정은 이 순서를 기준으로 합니다."
												/>
											</Section.Header>
											<Section.Body>
												<div className="grid gap-3 lg:grid-cols-4">
													{designSystemSurfaceRows.map((row) => (
														<div
															className="rounded-lg border border-border bg-background p-4"
															key={row.id}
														>
															<p className="text-xs font-semibold uppercase text-muted">
																{row.name}
															</p>
															<p className="mt-2 font-mono text-sm text-accent">
																{row.token}
															</p>
															<p className="mt-3 text-sm leading-5 text-muted">
																{row.usage}
															</p>
														</div>
													))}
												</div>
											</Section.Body>
										</Section>
									</SectionSurface>

									<SectionSurface>
										<Section>
											<Section.Header>
												<PageTitleBar
													level={2}
													title="Color And Type Rhythm"
													description="강조색은 상태를 드러내고, 배경색은 위계를 드러내는 역할로 분리합니다."
												/>
											</Section.Header>
											<Section.Body>
												<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
													<div className="grid gap-3 md:grid-cols-2">
														{[
															{
																name: "Primary",
																className: "bg-accent text-accent-foreground",
															},
															{
																name: "Success",
																className: "bg-success text-success-foreground",
															},
															{
																name: "Warning",
																className: "bg-warning text-warning-foreground",
															},
															{
																name: "Danger",
																className: "bg-danger text-danger-foreground",
															},
														].map((color) => (
															<div
																className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
																key={color.name}
															>
																<div
																	className={`size-9 rounded-lg ${color.className}`}
																/>
																<div>
																	<p className="text-sm font-semibold">
																		{color.name}
																	</p>
																	<p className="text-xs text-muted">
																		semantic state
																	</p>
																</div>
															</div>
														))}
													</div>
													<div className="rounded-lg border border-border bg-background p-4">
														<p className="text-xs font-semibold uppercase text-muted">
															Type scale
														</p>
														<p className="mt-3 text-2xl font-bold">
															Page title
														</p>
														<p className="mt-2 text-lg font-semibold">
															Section title
														</p>
														<p className="mt-2 text-sm font-medium">
															Control label
														</p>
														<p className="mt-2 text-sm leading-5 text-muted">
															Muted paragraph keeps dense admin copy readable
															without competing with the current task.
														</p>
													</div>
												</div>
											</Section.Body>
										</Section>
									</SectionSurface>
								</VStack>
							</div>
						) : null}

						{currentTab === "components" ? (
							<div
								aria-labelledby="design-system-tab-components"
								id="design-system-panel-components"
								role="tabpanel"
							>
								<VStack gap="section" fullWidth>
									<SectionSurface>
										<Section>
											<Section.Header>
												<PageTitleBar
													level={2}
													title="Actions And Inputs"
													description="반복되는 액션, 입력, 상태 chip을 같은 밀도로 배치합니다."
												/>
											</Section.Header>
											<Section.Body>
												<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
													<div className="rounded-lg border border-border bg-background p-4">
														<Input
															isReadOnly
															label="검색 입력"
															placeholder="이름, 이메일, 전화번호로 검색"
															startContent={
																<Search className="size-4 text-muted" />
															}
															value="샘플"
														/>
														<div className="mt-4 flex flex-wrap gap-2">
															<Button color="primary" size="sm">
																저장
															</Button>
															<Button size="sm" variant="flat">
																보조 액션
															</Button>
															<Button color="danger" size="sm" variant="flat">
																삭제
															</Button>
														</div>
													</div>
													<div className="rounded-lg border border-border bg-background p-4">
														<p className="text-sm font-semibold">
															Status Tokens
														</p>
														<div className="mt-3 flex flex-wrap gap-2">
															<Chip color="primary" variant="flat">
																Primary
															</Chip>
															<Chip color="success" variant="flat">
																Success
															</Chip>
															<Chip color="warning" variant="flat">
																Warning
															</Chip>
															<Badge color="accent" content="4" variant="soft">
																<Button size="sm" variant="flat">
																	Badge
																</Button>
															</Badge>
														</div>
													</div>
												</div>
											</Section.Body>
										</Section>
									</SectionSurface>

									<SectionSurface>
										<Section>
											<Section.Header>
												<PageTitleBar
													level={2}
													title="Data Display"
													description="DataGrid와 Table의 현재 밀도, 배경, border 리듬을 비교합니다."
												/>
											</Section.Header>
											<Section.Body>
												<div className="grid gap-4 xl:grid-cols-2">
													<div className="min-w-0 rounded-lg border border-border bg-background p-3">
														<DataGrid
															config={designSystemGridConfig}
															rows={designSystemGridRows}
															state={gridState}
															totalCount={designSystemGridRows.length}
														/>
													</div>
													<div className="min-w-0 rounded-lg border border-border bg-background p-3">
														<Table aria-label="디자인시스템 레이어 테이블">
															<Table.Content>
																<Table.Header>
																	<Table.Column key="layer">Layer</Table.Column>
																	<Table.Column key="surface">
																		Surface
																	</Table.Column>
																	<Table.Column key="status">
																		Status
																	</Table.Column>
																</Table.Header>
																<Table.Body>
																	<Table.Row key="screen">
																		<Table.Cell>Screen</Table.Cell>
																		<Table.Cell>default</Table.Cell>
																		<Table.Cell>baseline</Table.Cell>
																	</Table.Row>
																	<Table.Row key="section">
																		<Table.Cell>Section</Table.Cell>
																		<Table.Cell>secondary</Table.Cell>
																		<Table.Cell>review</Table.Cell>
																	</Table.Row>
																	<Table.Row key="widget">
																		<Table.Cell>Widget</Table.Cell>
																		<Table.Cell>tertiary</Table.Cell>
																		<Table.Cell>local only</Table.Cell>
																	</Table.Row>
																</Table.Body>
															</Table.Content>
														</Table>
													</div>
												</div>
											</Section.Body>
										</Section>
									</SectionSurface>

									<SectionSurface>
										<Section>
											<Section.Header>
												<PageTitleBar
													level={2}
													title="Feedback"
													description="성공, 경고, 로딩 상태가 화면 위계와 충돌하지 않는지 확인합니다."
												/>
											</Section.Header>
											<Section.Body>
												<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
													<div className="space-y-3">
														<Alert className="w-full" status="success">
															<Alert.Content className="space-y-1">
																<Alert.Title>동기화 완료</Alert.Title>
																<Alert.Description>
																	권한 정책이 역할 기준으로 정상
																	동기화되었습니다.
																</Alert.Description>
															</Alert.Content>
														</Alert>
														<Alert className="w-full" status="warning">
															<Alert.Content className="space-y-1">
																<Alert.Title>검토 필요</Alert.Title>
																<Alert.Description>
																	직접 배경 override가 남은 화면은 audit 탭에서
																	추적합니다.
																</Alert.Description>
															</Alert.Content>
														</Alert>
													</div>
													<div className="rounded-lg border border-border bg-background p-4">
														<div className="flex items-center gap-3">
															<Spinner aria-label="로딩 상태" size="sm" />
															<p className="text-sm font-semibold">
																Loading state
															</p>
														</div>
														<div className="mt-4 space-y-2">
															<Skeleton className="h-4 w-3/4 rounded-lg" />
															<Skeleton className="h-4 w-full rounded-lg" />
															<Skeleton className="h-4 w-1/2 rounded-lg" />
														</div>
													</div>
												</div>
											</Section.Body>
										</Section>
									</SectionSurface>
								</VStack>
							</div>
						) : null}

						{currentTab === "patterns" ? (
							<div
								aria-labelledby="design-system-tab-patterns"
								id="design-system-panel-patterns"
								role="tabpanel"
							>
								<VStack gap="section" fullWidth>
									<SectionSurface>
										<Section>
											<Section.Header>
												<PageTitleBar
													level={2}
													title="Screen Composition Patterns"
													description="컴포넌트 자유 조합보다 화면 단위 리듬을 먼저 고정합니다."
												/>
											</Section.Header>
											<Section.Body>
												<div className="grid gap-4 lg:grid-cols-3">
													{designSystemPatternRows.map((pattern) => (
														<div
															className="rounded-lg border border-border bg-background p-4"
															key={pattern.id}
														>
															<div className="flex items-center gap-2">
																<CheckCircle2 className="size-4 text-success" />
																<p className="text-sm font-semibold">
																	{pattern.title}
																</p>
															</div>
															<p className="mt-3 text-sm leading-5 text-muted">
																{pattern.description}
															</p>
														</div>
													))}
												</div>
												<div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
													<div className="rounded-lg border border-border bg-background p-4">
														<p className="text-sm font-semibold">
															Recommended admin order
														</p>
														<div className="mt-4 grid gap-3 md:grid-cols-4">
															{["Title", "Metrics", "Toolbar", "Data"].map(
																(step) => (
																	<div
																		className="rounded-lg border border-border bg-surface px-3 py-3 text-sm font-medium"
																		key={step}
																	>
																		{step}
																	</div>
																),
															)}
														</div>
													</div>
													<Surface className="p-4">
														<p className="text-sm font-semibold">
															Local Surface sample
														</p>
														<p className="mt-2 text-sm leading-5 text-muted">
															Surface는 feature/widget 내부에서만 짧게 사용하고,
															section 전체를 다시 감싸는 용도로 쓰지 않습니다.
														</p>
													</Surface>
												</div>
											</Section.Body>
										</Section>
									</SectionSurface>

									<SectionSurface>
										<Section layout="left" leftAsideWidth="sm">
											<Section.Header>
												<PageTitleBar
													level={2}
													title="Section Left Aside"
													description="좌측 필터나 하위 탐색을 본문과 같은 section boundary 안에 둡니다."
												/>
											</Section.Header>
											<Section.LeftAside>
												<div className="rounded-lg border border-border bg-background p-3 text-sm">
													<p className="font-semibold">Filter rail</p>
													<p className="mt-2 text-muted">
														leftAsideWidth=&quot;sm&quot; / 240px
													</p>
												</div>
											</Section.LeftAside>
											<Section.Body>
												<div className="rounded-lg border border-border bg-background p-4">
													<p className="text-sm font-semibold">Main content</p>
													<p className="mt-2 text-sm leading-5 text-muted">
														모바일에서는 Header 다음에 LeftAside, Body 순서로
														쌓입니다.
													</p>
												</div>
											</Section.Body>
										</Section>
									</SectionSurface>

									<SectionSurface>
										<Section layout="right" rightAsideWidth="md">
											<Section.Header>
												<PageTitleBar
													level={2}
													title="Section Right Aside"
													description="요약, 도움말, 보조 액션을 오른쪽 보조 컬럼으로 분리합니다."
												/>
											</Section.Header>
											<Section.Body>
												<div className="rounded-lg border border-border bg-background p-4">
													<p className="text-sm font-semibold">Main content</p>
													<p className="mt-2 text-sm leading-5 text-muted">
														Body는 좌우 layout에서도 본문 main slot입니다.
													</p>
												</div>
											</Section.Body>
											<Section.RightAside>
												<div className="rounded-lg border border-border bg-background p-3 text-sm">
													<p className="font-semibold">Summary</p>
													<p className="mt-2 text-muted">
														rightAsideWidth=&quot;md&quot; / 320px
													</p>
												</div>
											</Section.RightAside>
										</Section>
									</SectionSurface>

									<SectionSurface>
										<Section
											layout="both"
											leftAsideWidth="sm"
											rightAsideWidth="sm"
										>
											<Section.Header>
												<PageTitleBar
													level={2}
													title="Section Both Asides"
													description="좌측 탐색, 중앙 본문, 우측 요약이 모두 필요한 상세 화면 기준입니다."
												/>
											</Section.Header>
											<Section.LeftAside>
												<div className="rounded-lg border border-border bg-background p-3 text-sm">
													Left aside
												</div>
											</Section.LeftAside>
											<Section.Body>
												<div className="rounded-lg border border-border bg-background p-4">
													<p className="text-sm font-semibold">Main content</p>
													<p className="mt-2 text-sm leading-5 text-muted">
														desktop 이상에서 240px / 1fr / 240px grid로
														전환됩니다.
													</p>
												</div>
											</Section.Body>
											<Section.RightAside>
												<div className="rounded-lg border border-border bg-background p-3 text-sm">
													Right aside
												</div>
											</Section.RightAside>
											<Section.Footer>
												<div className="rounded-lg border border-border bg-background p-3 text-sm text-muted">
													Footer는 좌우 layout에서도 전체 폭으로 정렬됩니다.
												</div>
											</Section.Footer>
										</Section>
									</SectionSurface>
								</VStack>
							</div>
						) : null}

						{currentTab === "audit" ? (
							<div
								aria-labelledby="design-system-tab-audit"
								id="design-system-panel-audit"
								role="tabpanel"
							>
								<SectionSurface>
									<Section>
										<Section.Header>
											<PageTitleBar
												level={2}
												title="Current Admin Overrides"
												description="UserListScreen 계열에서 보이는 배경과 밀도 override를 수정 대상 목록으로 고정합니다."
												actions={
													<Chip color="warning" variant="flat">
														before refactor
													</Chip>
												}
											/>
										</Section.Header>
										<Section.Body>
											<div className="overflow-hidden rounded-lg border border-border bg-background">
												<table
													aria-label="현재 admin override 감사 테이블"
													className="min-w-full border-collapse text-left"
												>
													<thead className="bg-surface-secondary">
														<tr>
															<th className="px-4 py-3 text-xs font-semibold uppercase text-muted">
																Target
															</th>
															<th className="px-4 py-3 text-xs font-semibold uppercase text-muted">
																Current
															</th>
															<th className="px-4 py-3 text-xs font-semibold uppercase text-muted">
																Decision
															</th>
															<th className="px-4 py-3 text-xs font-semibold uppercase text-muted">
																Priority
															</th>
														</tr>
													</thead>
													<tbody>
														{designSystemAuditRows.map((row) => (
															<tr
																className="border-t border-border"
																key={row.id}
															>
																<td className="px-4 py-3 text-sm font-medium">
																	{row.target}
																</td>
																<td className="px-4 py-3 text-sm text-muted">
																	{row.current}
																</td>
																<td className="px-4 py-3 text-sm text-muted">
																	{row.decision}
																</td>
																<td className="px-4 py-3">
																	<Chip
																		color={
																			row.priority === "P1"
																				? "danger"
																				: "warning"
																		}
																		variant="flat"
																	>
																		{row.priority}
																	</Chip>
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
											<div className="mt-4 grid gap-3 lg:grid-cols-3">
												<div className="rounded-lg border border-border bg-background p-4">
													<div className="flex items-center gap-2">
														<AlertTriangle className="size-4 text-warning" />
														<p className="text-sm font-semibold">Do first</p>
													</div>
													<p className="mt-2 text-sm leading-5 text-muted">
														화면별 직접 배경 override를 걷어내고 surface
														계층으로 돌립니다.
													</p>
												</div>
												<div className="rounded-lg border border-border bg-background p-4">
													<div className="flex items-center gap-2">
														<Palette className="size-4 text-accent" />
														<p className="text-sm font-semibold">
															Keep visible
														</p>
													</div>
													<p className="mt-2 text-sm leading-5 text-muted">
														semantic color는 상태 표시에서만 강하게 쓰고, 구조는
														배경 위계가 담당합니다.
													</p>
												</div>
												<div className="rounded-lg border border-border bg-background p-4">
													<div className="flex items-center gap-2">
														<Database className="size-4 text-success" />
														<p className="text-sm font-semibold">
															Verify with stories
														</p>
													</div>
													<p className="mt-2 text-sm leading-5 text-muted">
														리듬 수정 후 이 화면과 실제 admin screen을 나란히
														확인합니다.
													</p>
												</div>
											</div>
										</Section.Body>
									</Section>
								</SectionSurface>
							</div>
						) : null}
					</VStack>
				</ScreenSurface>
			</div>
		);
	},
);

DesignSystemScreen.displayName = "DesignSystemScreen";

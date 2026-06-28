import { observer, useLocalObservable } from "mobx-react-lite";
import { ScrollView, View } from "react-native";
import { Button } from "../../action/Button";
import { Chip } from "../../data-display/Chip";
import { Text } from "../../data-display/Text";
import { Skeleton } from "../../feedback/Skeleton";
import { StatusFeedback } from "../../feedback/StatusFeedback";
import { Input } from "../../input/Input";
import { SearchField } from "../../input/SearchField";
import { Card } from "../../layout/Card";
import { ListGroup } from "../../layout/ListGroup";
import { ScreenActionBar } from "../../layout/ScreenActionBar";
import { ScreenFrame } from "../../layout/ScreenFrame";
import { VStack } from "../../rhythm";
import { Surface } from "../../surface";

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

const DEFAULT_DESIGN_SYSTEM_TAB: DesignSystemTabId = "overview";

const designSystemTabs: Array<{
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
		summary: "native primitives",
	},
	{
		id: "patterns",
		label: "Patterns",
		summary: "mobile composition",
	},
	{
		id: "audit",
		label: "Audit",
		summary: "current risks",
	},
];

const designSystemTabIds = designSystemTabs.map(({ id }) => id);

const isDesignSystemTabId = (value: unknown): value is DesignSystemTabId =>
	typeof value === "string" &&
	designSystemTabIds.includes(value as DesignSystemTabId);

const mobilePatternRows = [
	{
		id: "reservation-home",
		title: "Home screen",
		description:
			"상단 상태, 주요 CTA, 반복 리스트를 같은 폭과 간격으로 유지합니다.",
	},
	{
		id: "reservation-checkout",
		title: "Checkout screen",
		description:
			"요약, 결제 정보, 하단 action bar를 분리해 스캔 순서를 만듭니다.",
	},
	{
		id: "my-page",
		title: "Profile screen",
		description:
			"계정 정보와 위험 액션은 같은 카드 안에서 경쟁시키지 않습니다.",
	},
];

export const DesignSystemScreen = observer(
	({ activeTab, onChangeTab }: DesignSystemScreenProps) => {
		const currentTab = isDesignSystemTabId(activeTab)
			? activeTab
			: DEFAULT_DESIGN_SYSTEM_TAB;
		const inputState = useLocalObservable(() => ({
			name: "예약자",
			query: "샘플 검색",
		}));

		return (
			<ScreenFrame className="bg-background" edges={["left", "right"]}>
				<ScrollView contentContainerClassName="gap-4 px-4 py-5">
					<View className="gap-2">
						<View className="flex-row flex-wrap gap-2">
							<Chip color="accent" variant="primary">
								Storybook only
							</Chip>
							<Chip color="success" variant="secondary">
								Expo Web
							</Chip>
						</View>
						<Text className="text-2xl font-extrabold text-foreground">
							DesignSystemScreen
						</Text>
						<Text className="text-sm leading-5 text-muted">
							mobile/Expo Web 화면 리듬을 고치기 전에 현재 표면, 입력, 상태,
							하단 액션 구조를 한 곳에서 확인합니다.
						</Text>
					</View>

					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerClassName="gap-2 pr-4"
					>
						{designSystemTabs.map((tab) => {
							const isSelected = tab.id === currentTab;

							return (
								<Button
									accessibilityRole="tab"
									accessibilityState={{ selected: isSelected }}
									className="min-h-11 min-w-32 rounded-lg px-3"
									key={tab.id}
									onPress={() => onChangeTab?.(tab.id)}
									variant={isSelected ? "primary" : "secondary"}
								>
									{tab.label}
								</Button>
							);
						})}
					</ScrollView>

					{currentTab === "overview" ? (
						<Surface className="gap-4 rounded-xl border border-border p-4">
							<Text className="text-base font-extrabold text-foreground">
								Mobile Screen Map
							</Text>
							<View className="flex-row flex-wrap gap-3">
								{[
									["Screens", "2", "web, mobile"],
									["Layers", "4", "surface stack"],
									["Inputs", "3", "search, text, action"],
									["Risks", "4", "override targets"],
								].map(([label, value, caption]) => (
									<View
										className="min-w-[47%] flex-1 rounded-lg border border-border bg-white px-3 py-3 dark:border-white/10 dark:bg-neutral-600"
										key={label}
									>
										<Text className="text-xs font-bold uppercase text-muted">
											{label}
										</Text>
										<Text className="mt-1 text-xl font-extrabold text-foreground">
											{value}
										</Text>
										<Text className="mt-1 text-xs text-muted">{caption}</Text>
									</View>
								))}
							</View>
							<ListGroup
								items={[
									{
										description: "안전영역과 전체 화면 배경을 담당합니다.",
										id: "screen-frame",
										title: "ScreenFrame",
									},
									{
										description: "화면 본문 섹션의 기본 표면입니다.",
										id: "surface",
										title: "Surface",
									},
									{
										description: "하단 CTA와 본문 표면을 분리합니다.",
										id: "action-bar",
										title: "ScreenActionBar",
									},
								]}
							/>
						</Surface>
					) : null}

					{currentTab === "foundations" ? (
						<Surface className="gap-4 rounded-xl border border-border p-4">
							<Text className="text-base font-extrabold text-foreground">
								Surface And Typography
							</Text>
							<View className="gap-3">
								<View className="rounded-lg border border-border bg-white px-3 py-3 dark:border-white/10 dark:bg-neutral-600">
									<Text className="text-xs font-bold uppercase text-muted">
										ScreenFrame
									</Text>
									<Text className="mt-1 text-sm text-foreground">
										backgroundColor #09090b
									</Text>
								</View>
								<Card description="HeroUI Native Card scaffold" title="Card">
									<Text className="text-sm leading-5 text-muted">
										제목, 설명, 본문을 가진 mobile card 기준입니다.
									</Text>
								</Card>
								<View className="rounded-lg border border-border bg-white px-3 py-3 dark:border-white/10 dark:bg-neutral-600">
									<Text className="text-xl font-extrabold text-foreground">
										Title text
									</Text>
									<Text className="mt-2 text-base font-bold text-foreground">
										Section text
									</Text>
									<Text className="mt-2 text-sm leading-5 text-muted">
										Muted paragraph는 반복 화면에서 설명 밀도를 낮춥니다.
									</Text>
								</View>
							</View>
						</Surface>
					) : null}

					{currentTab === "components" ? (
						<VStack gap="section" fullWidth>
							<Surface className="gap-4 rounded-xl border border-border p-4">
								<Text className="text-base font-extrabold text-foreground">
									Actions And Inputs
								</Text>
								<SearchField
									inputProps={{ placeholder: "예약, 지점, 프로그램 검색" }}
									label="검색"
									path="query"
									state={inputState}
								/>
								<Input
									helperText="현재 TextField, InputGroup, FieldError 리듬 확인용입니다."
									label="이름"
									path="name"
									state={inputState}
								/>
								<View className="flex-row gap-2">
									<Button className="flex-1 rounded-lg" variant="primary">
										Primary
									</Button>
									<Button className="flex-1 rounded-lg" variant="secondary">
										Secondary
									</Button>
								</View>
								<View className="flex-row flex-wrap gap-2">
									<Chip color="accent" variant="primary">
										Accent
									</Chip>
									<Chip color="success" variant="secondary">
										Success
									</Chip>
									<Chip color="warning" variant="secondary">
										Warning
									</Chip>
								</View>
							</Surface>

							<Surface className="gap-4 rounded-xl border border-border p-4">
								<Text className="text-base font-extrabold text-foreground">
									Feedback
								</Text>
								<StatusFeedback
									description="현재 feedback card가 표면 위에서 차지하는 밀도와 색상 강조를 확인합니다."
									status="success"
									title="예약 상태를 확인했습니다"
								/>
								<View className="gap-2 rounded-lg border border-border bg-white p-3 dark:border-white/10 dark:bg-neutral-600">
									<Skeleton className="h-4 w-3/4 rounded-lg" />
									<Skeleton className="h-4 w-full rounded-lg" />
									<Skeleton className="h-4 w-1/2 rounded-lg" />
								</View>
							</Surface>
						</VStack>
					) : null}

					{currentTab === "patterns" ? (
						<Surface className="gap-4 rounded-xl border border-border p-4">
							<Text className="text-base font-extrabold text-foreground">
								Mobile Composition Patterns
							</Text>
							<ListGroup
								items={mobilePatternRows.map((row) => ({
									description: row.description,
									id: row.id,
									title: row.title,
								}))}
							/>
							<View className="gap-2 rounded-lg border border-border bg-white p-3 dark:border-white/10 dark:bg-neutral-600">
								{[
									"Header",
									"Primary content",
									"Support list",
									"Action bar",
								].map((step) => (
									<View
										className="rounded-lg border border-border bg-neutral-50 px-3 py-3 dark:border-white/10 dark:bg-neutral-700"
										key={step}
									>
										<Text className="text-sm font-bold text-foreground">
											{step}
										</Text>
									</View>
								))}
							</View>
						</Surface>
					) : null}

					{currentTab === "audit" ? (
						<Surface className="gap-4 rounded-xl border border-border p-4">
							<Text className="text-base font-extrabold text-foreground">
								Current Mobile Risks
							</Text>
							<ListGroup
								items={[
									{
										description:
											"Surface, Card, ListGroup 배경 단계가 화면마다 다르게 보일 수 있습니다.",
										id: "surface-rhythm",
										title: "Surface rhythm",
									},
									{
										description:
											"ScreenActionBar가 본문 Surface와 붙을 때 CTA 우선순위가 흐려질 수 있습니다.",
										id: "action-priority",
										title: "Action priority",
									},
									{
										description:
											"SearchField와 Input 높이가 서로 달라 toolbar 밀도를 흔들 수 있습니다.",
										id: "input-density",
										title: "Input density",
									},
								]}
							/>
						</Surface>
					) : null}

					<ScreenActionBar
						description="하단 CTA 표면과 화면 본문 표면이 충돌하는지 확인합니다."
						onPressPrimaryAction={() => undefined}
						onPressSecondaryAction={() => undefined}
						orientation="horizontal"
						primaryActionLabel="계속"
						secondaryActionLabel="취소"
					/>
				</ScrollView>
			</ScreenFrame>
		);
	},
);

DesignSystemScreen.displayName = "DesignSystemScreen";

import type { PlanningScenario } from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { Surface } from "../../surface/Surface";
import { PlanningPreviewFrame } from "./PlanningPreviewFrame";

const readyScenario = {
	id: "mobile-reservation-home",
	title: "Reservation home",
	description: "예약 홈 화면의 모바일 Storybook 기획 검수 시나리오입니다.",
	routePath: "/reservation",
	owner: "fe-screen-agent",
	status: "ready-for-review",
	context: {
		realm: "mobile",
		role: "member",
		tenantId: "tenant-onora",
		spaceId: "space-gangnam",
		abilities: ["reservation.read", "reservation.create"],
		locale: "ko-KR",
		viewport: "mobile",
	},
	api: {
		name: "reservation-home-fixture",
		mode: "native-mock",
		requests: [
			{
				method: "GET",
				path: "/mobile/reservations/summary",
				status: 200,
			},
			{
				method: "GET",
				path: "/mobile/spaces/current",
				status: 200,
			},
		],
	},
	acceptance: [
		{ label: "예약 가능한 수업 목록을 첫 화면에서 확인할 수 있습니다." },
		{ label: "현재 지점과 예약 상태가 한 화면 안에서 구분됩니다." },
	],
} satisfies PlanningScenario;

const minimalScenario = {
	id: "mobile-empty-planning",
	title: "Minimal planning",
	context: {
		realm: "mobile",
		viewport: "mobile",
	},
	api: {
		name: "none",
		mode: "none",
	},
	acceptance: [],
} satisfies PlanningScenario;

const PreviewCard = () => (
	<Surface className="gap-2 rounded-xl p-4" variant="default">
		<Text className="text-xs font-bold uppercase text-primary">Preview</Text>
		<Text className="text-lg font-extrabold text-foreground">
			오늘 예약
		</Text>
		<Text className="text-sm leading-5 text-muted">
			오전 10:30 리포머 그룹 수업이 예약되어 있습니다.
		</Text>
	</Surface>
);

const meta = {
	title: "feature/PlanningPreviewFrame",
	component: PlanningPreviewFrame,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof PlanningPreviewFrame>;

export default meta;

type Story = StoryObj;

export const Ready: Story = {
	render: () => (
		<PlanningPreviewFrame scenario={readyScenario}>
			<PreviewCard />
		</PlanningPreviewFrame>
	),
};

export const Minimal: Story = {
	render: () => (
		<PlanningPreviewFrame scenario={minimalScenario}>
			<View className="rounded-xl border border-dashed border-border bg-surface p-4">
				<Text className="text-sm text-muted">
					기획 메타데이터가 최소값일 때 비어 있는 필드와 acceptance 상태를
					확인합니다.
				</Text>
			</View>
		</PlanningPreviewFrame>
	),
};

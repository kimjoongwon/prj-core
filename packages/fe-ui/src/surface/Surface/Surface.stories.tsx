import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../input/Button/Button";
import { Surface } from "./Surface";

const meta = {
	title: "surface/Surface",
	component: Surface,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
	args: {
		children: null,
	},
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FeaturePanel: Story = {
	args: {
		children: (
			<div className="flex flex-col gap-4">
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0">
						<p className="text-sm font-semibold">예약 요약</p>
						<p className="mt-1 text-sm text-muted">
							feature/widget 내부에서 독립 패널이 필요할 때 쓰는 표면입니다.
						</p>
					</div>
					<Button size="sm" variant="flat">
						내보내기
					</Button>
				</div>
				<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
					<div className="rounded-lg border border-border/70 bg-white p-4 dark:border-white/10 dark:bg-neutral-600">
						<p className="text-xs text-muted">예약</p>
						<p className="mt-2 text-xl font-semibold">128건</p>
					</div>
					<div className="rounded-lg border border-border/70 bg-white p-4 dark:border-white/10 dark:bg-neutral-600">
						<p className="text-xs text-muted">확정</p>
						<p className="mt-2 text-xl font-semibold">112건</p>
					</div>
					<div className="rounded-lg border border-border/70 bg-white p-4 dark:border-white/10 dark:bg-neutral-600">
						<p className="text-xs text-muted">취소</p>
						<p className="mt-2 text-xl font-semibold">3건</p>
					</div>
				</div>
			</div>
		),
	},
};

export const Variants: Story = {
	render: () => (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			<Surface variant="default">
				<p className="text-sm font-semibold">default</p>
				<p className="mt-1 text-sm text-muted">ScreenSurface의 기본 variant</p>
			</Surface>
			<Surface variant="secondary">
				<p className="text-sm font-semibold">secondary</p>
				<p className="mt-1 text-sm text-muted">
					SectionSurface와 local Surface의 기본 variant
				</p>
			</Surface>
			<Surface variant="tertiary">
				<p className="text-sm font-semibold">tertiary</p>
				<p className="mt-1 text-sm text-muted">더 낮은 보조 표면</p>
			</Surface>
			<Surface variant="transparent">
				<p className="text-sm font-semibold">transparent</p>
				<p className="mt-1 text-sm text-muted">배경을 얇게 비우는 표면</p>
			</Surface>
		</div>
	),
};

export const TablePanel: Story = {
	render: () => (
		<Surface className="overflow-hidden">
			<div className="flex items-center justify-between border-border border-b px-5 py-4">
				<div>
					<p className="text-sm font-semibold">최근 예약</p>
					<p className="mt-1 text-xs text-muted">widget local table panel</p>
				</div>
				<Button size="sm" variant="flat">
					필터
				</Button>
			</div>
			<div className="divide-y divide-border">
				<div className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
					<span>김하나</span>
					<span className="text-muted">모닝 플로우</span>
					<span className="text-right font-medium">10:00</span>
				</div>
				<div className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
					<span>박도윤</span>
					<span className="text-muted">저녁 클래스</span>
					<span className="text-right font-medium">14:00</span>
				</div>
				<div className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
					<span>이서연</span>
					<span className="text-muted">스트렝스</span>
					<span className="text-right font-medium">19:00</span>
				</div>
			</div>
		</Surface>
	),
};

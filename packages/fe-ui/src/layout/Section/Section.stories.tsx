import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "../../data-display/Typography";
import { Button } from "../../input";
import { SectionSurface } from "../../surface";
import { Section } from "./Section";

const meta = {
	title: "layout/Section",
	component: Section,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Screen 안의 의미 있는 section layout 구조입니다. 표면은 surface/SectionSurface가 담당합니다.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Section>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = {
	render: () => (
		<div className="w-[720px]">
			<SectionSurface>
				<Section>
					<Section.Header
						title="기본 정보"
						description="section inset과 header/body gap을 Section이 책임집니다."
						actions={<Button size="sm">편집</Button>}
					/>
					<Section.Body>
						<div className="grid grid-cols-2 gap-3">
							<div className="rounded-lg border border-border bg-background px-3 py-2">
								<Typography>Name</Typography>
							</div>
							<div className="rounded-lg border border-border bg-background px-3 py-2">
								<Typography>Status</Typography>
							</div>
						</div>
					</Section.Body>
				</Section>
			</SectionSurface>
		</div>
	),
};
export const DataArea: Story = {
	render: () => (
		<div className="w-[720px]">
			<SectionSurface className="overflow-hidden">
				<Section overflow="hidden">
					<Section.Body>
						<div className="grid grid-cols-3 bg-surface-secondary px-4 py-3">
							<Typography color="muted" type="body-xs">
								Name
							</Typography>
							<Typography color="muted" type="body-xs">
								Owner
							</Typography>
							<Typography color="muted" type="body-xs">
								Status
							</Typography>
						</div>
						<div className="grid grid-cols-3 border-border border-t px-4 py-3">
							<Typography type="body-sm">DataGrid wrapper</Typography>
							<Typography type="body-sm">layout/Section</Typography>
							<Typography type="body-sm">기본 inset</Typography>
						</div>
					</Section.Body>
				</Section>
			</SectionSurface>
		</div>
	),
};
export const LeftAside: Story = {
	render: () => (
		<div className="w-full max-w-[920px]">
			<SectionSurface>
				<Section layout="left" leftAsideWidth="sm">
					<Section.Header
						title="좌측 보조 영역"
						description="좌측 navigation/filter와 본문을 하나의 section boundary 안에서 배치합니다."
					/>
					<Section.LeftAside>
						<div className="rounded-lg border border-border bg-background p-3">
							<Typography.Paragraph size="sm" weight="semibold">
								Filter rail
							</Typography.Paragraph>
							<Typography.Paragraph className="mt-2" color="muted" size="sm">
								모바일에서는 슬롯 순서대로 위에 쌓입니다.
							</Typography.Paragraph>
						</div>
					</Section.LeftAside>
					<Section.Body>
						<div className="min-h-32 rounded-lg border border-border bg-background p-4">
							<Typography>Main body</Typography>
						</div>
					</Section.Body>
				</Section>
			</SectionSurface>
		</div>
	),
};
export const RightAside: Story = {
	render: () => (
		<div className="w-full max-w-[920px]">
			<SectionSurface>
				<Section layout="right" rightAsideWidth="md">
					<Section.Header
						title="우측 보조 영역"
						description="본문 오른쪽에 요약, 도움말, 액션 패널을 배치합니다."
					/>
					<Section.Body>
						<div className="min-h-32 rounded-lg border border-border bg-background p-4">
							<Typography>Main body</Typography>
						</div>
					</Section.Body>
					<Section.RightAside>
						<div className="rounded-lg border border-border bg-background p-3">
							<Typography.Paragraph size="sm" weight="semibold">
								Summary panel
							</Typography.Paragraph>
							<Typography.Paragraph className="mt-2" color="muted" size="sm">
								desktop에서는 320px 컬럼입니다.
							</Typography.Paragraph>
						</div>
					</Section.RightAside>
				</Section>
			</SectionSurface>
		</div>
	),
};
export const BothAsides: Story = {
	render: () => (
		<div className="w-full max-w-[1080px]">
			<SectionSurface>
				<Section layout="both" leftAsideWidth="sm" rightAsideWidth="sm">
					<Section.Header
						title="양쪽 보조 영역"
						description="좌측 탐색, 본문, 우측 요약을 같은 section 안에서 정렬합니다."
					/>
					<Section.LeftAside>
						<div className="rounded-lg border border-border bg-background p-3">
							<Typography.Paragraph size="sm">Left aside</Typography.Paragraph>
						</div>
					</Section.LeftAside>
					<Section.Body>
						<div className="min-h-36 rounded-lg border border-border bg-background p-4">
							<Typography>Main body</Typography>
						</div>
					</Section.Body>
					<Section.RightAside>
						<div className="rounded-lg border border-border bg-background p-3">
							<Typography.Paragraph size="sm">Right aside</Typography.Paragraph>
						</div>
					</Section.RightAside>
					<Section.Footer>
						<div className="rounded-lg border border-border bg-background p-3">
							<Typography.Paragraph color="muted" size="sm">
								Footer는 좌우 layout에서도 전체 폭을 차지합니다.
							</Typography.Paragraph>
						</div>
					</Section.Footer>
				</Section>
			</SectionSurface>
		</div>
	),
};

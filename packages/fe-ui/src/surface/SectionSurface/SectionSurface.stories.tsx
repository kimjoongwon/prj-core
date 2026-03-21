import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@heroui/react";
import { Section } from "../../layout/Section";
import { PageTitleBar } from "../../widget/PageTitleBar";
import { SectionSurface } from "./SectionSurface";

const meta: Meta<typeof SectionSurface> = {
	title: "Surface/SectionSurface",
	component: SectionSurface,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: (
			<div className="text-default-600 text-sm">기본 섹션 표면입니다.</div>
		),
	},
};

export const Titled: Story = {
	render: () => (
		<SectionSurface>
			<Section
				top={
					<PageTitleBar
						level={2}
						title="기본 정보"
						description="섹션 구조는 Section이, 표면은 SectionSurface가 담당합니다."
						actions={
							<Button size="sm" variant="flat">
								편집
							</Button>
						}
					/>
				}
			>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<p className="text-default-500 text-sm">이름</p>
						<p className="mt-1 font-medium">홍길동</p>
					</div>
					<div>
						<p className="text-default-500 text-sm">이메일</p>
						<p className="mt-1 font-medium">hong@example.com</p>
					</div>
				</div>
			</Section>
		</SectionSurface>
	),
};

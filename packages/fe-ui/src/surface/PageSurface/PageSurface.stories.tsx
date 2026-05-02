import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@cocrepo/ui/heroui";
import { Page } from "../../layout/Page";
import { PageTitleBar } from "../../widget/PageTitleBar";
import { PageSurface } from "./PageSurface";
import { SectionSurface } from "../SectionSurface";

const meta: Meta<typeof PageSurface> = {
	title: "Surface/PageSurface",
	component: PageSurface,
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
			<div className="text-default-600 text-sm">
				페이지 본문이 올라가는 raised 표면입니다.
			</div>
		),
	},
};

export const WithPageLayout: Story = {
	render: () => (
		<Page
			top={
				<PageTitleBar
					title="에셋 관리"
					description="Page는 구조를, PageSurface는 표현을 담당합니다."
					actions={
						<Button size="sm" variant="flat" color="primary">
							업로드
						</Button>
					}
				/>
			}
		>
			<PageSurface>
				<div className="flex flex-col gap-4">
					<SectionSurface>
						<div className="text-default-600 text-sm">
							Page 아래에서 시각적 페이지 표면으로 사용합니다.
						</div>
					</SectionSurface>
				</div>
			</PageSurface>
		</Page>
	),
};

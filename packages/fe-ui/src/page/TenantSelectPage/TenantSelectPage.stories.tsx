import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryStage } from "../storybookFrame";
import { TenantSelectPage } from "./TenantSelectPage";

const meta = {
	component: TenantSelectPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: {
		tenants: [
			{ id: "hq", name: "본사" },
			{ id: "gangnam", name: "강남 지점" },
			{ id: "mapo", name: "마포 지점" },
		],
		onSelect: () => undefined,
	},
} satisfies Meta<typeof TenantSelectPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderTenantSelectPage: Story["render"] = (args) => (
	<PageStoryStage>
		<TenantSelectPage {...args} />
	</PageStoryStage>
);

export const Default: Story = {
	render: renderTenantSelectPage,
};

export const RegionalBranches: Story = {
	args: {
		tenants: [
			{ id: "hq", name: "본사" },
			{ id: "gangnam", name: "강남 지점" },
			{ id: "mapo", name: "마포 지점" },
			{ id: "busan", name: "부산 센터" },
			{ id: "jeju", name: "제주 센터" },
		],
	},
	render: renderTenantSelectPage,
};

import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryStage } from "../storybookFrame";
import { TenantSelectScreen } from "./TenantSelectScreen";

const meta = {
	component: TenantSelectScreen,
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
} satisfies Meta<typeof TenantSelectScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderTenantSelectScreen: Story["render"] = (args) => (
	<PageStoryStage>
		<TenantSelectScreen {...args} />
	</PageStoryStage>
);

export const Default: Story = {
	render: renderTenantSelectScreen,
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
	render: renderTenantSelectScreen,
};

import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryStage } from "../storybookFrame";
import { GroundsSelectScreen } from "./GroundsSelectScreen";

const meta = {
	component: GroundsSelectScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: {
		grounds: [
			{ id: "main", name: "메인 그라운드" },
			{ id: "ops", name: "운영 그라운드" },
			{ id: "partner", name: "파트너 그라운드" },
		],
		onSelect: () => undefined,
	},
} satisfies Meta<typeof GroundsSelectScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderGroundsSelectScreen: Story["render"] = (args) => (
	<PageStoryStage>
		<GroundsSelectScreen {...args} />
	</PageStoryStage>
);

export const Default: Story = {
	render: renderGroundsSelectScreen,
};

export const ManyGrounds: Story = {
	args: {
		grounds: [
			{ id: "main", name: "메인 그라운드" },
			{ id: "ops", name: "운영 그라운드" },
			{ id: "partner", name: "파트너 그라운드" },
			{ id: "studio", name: "스튜디오 예약 그라운드" },
			{ id: "crm", name: "CRM 테스트 그라운드" },
		],
	},
	render: renderGroundsSelectScreen,
};

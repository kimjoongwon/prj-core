import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import {
	DesignSystemScreen,
	type DesignSystemTabId,
} from "./DesignSystemScreen";

const ControlledDesignSystemScreen = () => {
	const [activeTab, setActiveTab] = useState<DesignSystemTabId>("overview");

	return (
		<DesignSystemScreen activeTab={activeTab} onChangeTab={setActiveTab} />
	);
};

const meta = {
	title: "design-system/DesignSystemScreen",
	component: DesignSystemScreen,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof DesignSystemScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <ControlledDesignSystemScreen />,
};

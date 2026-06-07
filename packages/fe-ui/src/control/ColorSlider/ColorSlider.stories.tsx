import type { Meta, StoryObj } from "@storybook/react";
import { parseColor } from "@heroui/react";
import { ColorSlider } from "./ColorSlider";

const meta: Meta = {
	title: "control/ColorSlider",
	component: ColorSlider,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ColorSlider
			aria-label="색상 Hue"
			channel="hue"
			defaultValue={parseColor("hsl(220, 80%, 50%)")}
		/>
	),
};

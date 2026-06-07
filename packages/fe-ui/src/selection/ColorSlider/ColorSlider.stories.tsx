import type { Meta, StoryObj } from "@storybook/react";
import { parseColor } from "@heroui/react";
import { ColorSlider } from "./ColorSlider";

const meta: Meta = {
	title: "selection/ColorSlider",
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
			className="w-64"
			defaultValue={parseColor("hsl(220, 80%, 50%)")}
		>
			<ColorSlider.Output />
			<ColorSlider.Track>
				<ColorSlider.Thumb />
			</ColorSlider.Track>
		</ColorSlider>
	),
};

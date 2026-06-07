import type { Meta, StoryObj } from "@storybook/react";
import { parseColor } from "@heroui/react";
import { ColorSwatchPicker } from "./ColorSwatchPicker";

const meta: Meta<typeof ColorSwatchPicker> = {
	title: "selection/ColorSwatchPicker",
	component: ColorSwatchPicker,
	tags: ["autodocs"],
	argTypes: {
		children: {
			table: {
				disable: true,
			},
			control: false,
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		"aria-label": "브랜드 색상",
		defaultValue: parseColor("#2563eb"),
	},
	render: (args) => (
		<ColorSwatchPicker {...args}>
			<>
				<ColorSwatchPicker.Item color="#2563eb">
					<ColorSwatchPicker.Swatch />
					<ColorSwatchPicker.Indicator />
				</ColorSwatchPicker.Item>
				<ColorSwatchPicker.Item color="#16a34a">
					<ColorSwatchPicker.Swatch />
					<ColorSwatchPicker.Indicator />
				</ColorSwatchPicker.Item>
				<ColorSwatchPicker.Item color="#dc2626">
					<ColorSwatchPicker.Swatch />
					<ColorSwatchPicker.Indicator />
				</ColorSwatchPicker.Item>
			</>
		</ColorSwatchPicker>
	),
};

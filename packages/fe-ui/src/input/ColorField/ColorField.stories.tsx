import type { Meta, StoryObj } from "@storybook/react";
import { parseColor } from "@heroui/react";
import { ColorField } from "./ColorField";

const meta: Meta<typeof ColorField> = {
	title: "input/ColorField",
	component: ColorField,
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
		<ColorField {...args}>
			<ColorField.Group>
				<ColorField.Prefix>#</ColorField.Prefix>
				<ColorField.Input />
			</ColorField.Group>
		</ColorField>
	),
};

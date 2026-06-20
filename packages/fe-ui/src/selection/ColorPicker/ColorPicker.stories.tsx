import { ColorArea, ColorSlider, parseColor } from "@heroui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { ColorPicker } from "./ColorPicker";

const meta: Meta<typeof ColorPicker> = {
	title: "selection/ColorPicker",
	component: ColorPicker,
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
		defaultValue: parseColor("#2563eb"),
	},
	render: (args) => (
		<ColorPicker {...args}>
			<ColorPicker.Trigger aria-label="브랜드 색상 선택">
				<span className="block size-5 rounded-md bg-primary" />
			</ColorPicker.Trigger>
			<ColorPicker.Popover>
				<div className="flex w-64 flex-col gap-3 p-2">
					<ColorArea colorSpace="rgb" xChannel="red" yChannel="green">
						<ColorArea.Thumb />
					</ColorArea>
					<ColorSlider channel="blue">
						<ColorSlider.Track>
							<ColorSlider.Thumb />
						</ColorSlider.Track>
					</ColorSlider>
				</div>
			</ColorPicker.Popover>
		</ColorPicker>
	),
};

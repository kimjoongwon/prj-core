import type { Meta, StoryObj } from "@storybook/react";
import { TimeField } from "@heroui/react";
import { useState } from "react";
import { TimeInput } from "./TimeInput";

const meta: Meta<typeof TimeInput> = {
	title: "input/TimeInput",
	component: TimeInput,
	parameters: {
		layout: "centered",
	},
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
		label: "Select a time",
	},
	render: (args) => {
		const [_value, setValue] = useState<string>("");
		return (
			<TimeInput {...args} onChange={setValue}>
				<TimeField.Group>
					<TimeField.Input>
						{(segment) => <TimeField.Segment segment={segment} />}
					</TimeField.Input>
				</TimeField.Group>
			</TimeInput>
		);
	},
};

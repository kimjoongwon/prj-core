import type { Meta, StoryObj } from "@storybook/react";
import { InputOTP } from "./InputOTP";

const meta: Meta<typeof InputOTP> = {
	title: "input/InputOTP",
	component: InputOTP,
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
		defaultValue: "123456",
		maxLength: 6,
	},
	render: (args) => (
		<InputOTP {...args}>
			<>
				<InputOTP.Group>
					<InputOTP.Slot index={0} />
					<InputOTP.Slot index={1} />
					<InputOTP.Slot index={2} />
				</InputOTP.Group>
				<InputOTP.Separator />
				<InputOTP.Group>
					<InputOTP.Slot index={3} />
					<InputOTP.Slot index={4} />
					<InputOTP.Slot index={5} />
				</InputOTP.Group>
			</>
		</InputOTP>
	),
};

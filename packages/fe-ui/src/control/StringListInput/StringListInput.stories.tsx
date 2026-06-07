import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { StringListInput } from "./StringListInput";

const meta = {
	title: "control/StringListInput",
	component: StringListInput,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof StringListInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: ["https://example.com/callback"],
		onChange: () => undefined,
		placeholder: "https://example.com/callback",
	},
	render: () => {
		const [value, setValue] = useState(["https://example.com/callback"]);

		return (
			<div className="w-[420px]">
				<StringListInput
					value={value}
					onChange={setValue}
					placeholder="https://example.com/callback"
				/>
			</div>
		);
	},
};

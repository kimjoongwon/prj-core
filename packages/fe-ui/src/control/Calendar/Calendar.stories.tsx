import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Calendar } from "./Calendar";

const meta: Meta<typeof Calendar> = {
	title: "control/Calendar",
	component: Calendar,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState<string[]>([
			new Date(2026, 5, 7).toISOString(),
			new Date(2026, 5, 12).toISOString(),
		]);

		return (
			<div className="w-[720px]">
				<Calendar value={value} onChange={setValue} />
			</div>
		);
	},
};

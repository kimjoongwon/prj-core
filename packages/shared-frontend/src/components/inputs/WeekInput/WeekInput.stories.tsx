import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
import { WeekInput } from "./WeekInput";

const meta: Meta<typeof WeekInput> = {
	title: "Inputs/WeekInput",
	component: WeekInput,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story['render'] = (args) => {
	const state = useLocalObservable(() => ({ day: args.state?.day || "MONDAY" }));
	return <WeekInput {...args} state={state} path="day" />;
};

export const Default: Story = {
	args: {
		state: { day: "MONDAY" },
	},
	render: Template,
};

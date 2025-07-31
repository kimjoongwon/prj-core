import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
import { TimeInput } from "./TimeInput";

const meta: Meta<typeof TimeInput> = {
	title: "Inputs/TimeInput",
	component: TimeInput,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story['render'] = (args) => {
	const state = useLocalObservable(() => ({ time: args.state?.time || new Date().toISOString() }));
	return <TimeInput {...args} state={state} path="time" />;
};

export const Default: Story = {
	args: {
		label: "Select a time",
		state: { time: new Date().toISOString() },
	},
	render: Template,
};

import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
import { TimePicker } from "./TimePicker";

const meta: Meta<typeof TimePicker> = {
	title: "Inputs/TimePicker",
	component: TimePicker,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story["render"] = (args) => {
	const state = useLocalObservable(() => ({
		// @ts-ignore
		time: args.state?.time || "12:00",
	}));
	return <TimePicker {...args} state={state} path="time" />;
};

export const Default: Story = {
	args: {
		state: { time: "12:00" },
	},
	render: Template,
};

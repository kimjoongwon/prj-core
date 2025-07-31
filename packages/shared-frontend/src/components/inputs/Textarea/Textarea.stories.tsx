import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
	title: "Inputs/Textarea",
	component: Textarea,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story['render'] = (args) => {
	const state = useLocalObservable(() => ({ text: args.state?.text || "" }));
	return <Textarea {...args} state={state} path="text" />;
};

export const Default: Story = {
	args: {
		label: "Description",
		placeholder: "Enter a description...",
		state: { text: "" },
	},
	render: Template,
};

export const WithInitialValue: Story = {
	args: {
		label: "Description",
		state: { text: "This is a default description." },
	},
	render: Template,
};

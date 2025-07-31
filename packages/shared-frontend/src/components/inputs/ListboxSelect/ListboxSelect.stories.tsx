import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
import { ListboxSelect } from "./ListboxSelect";

const meta: Meta<typeof ListboxSelect> = {
	title: "Inputs/ListboxSelect",
	component: ListboxSelect,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const options = [
	{ text: "Option 1", value: "1" },
	{ text: "Option 2", value: "2" },
	{ text: "Option 3", value: "3" },
];

const Template: Story["render"] = (args) => {
	// @ts-ignore
	const state = useLocalObservable(() => ({ value: args.state?.value || [] }));
	return <ListboxSelect {...args} state={state} path="value" />;
};

export const Default: Story = {
	args: {
		title: "Select an option",
		options,
		selectionMode: "single",
		state: { value: "1" },
	},
	render: Template,
};

export const MultiSelect: Story = {
	args: {
		title: "Select multiple options",
		options,
		selectionMode: "multiple",
		state: { value: ["1", "3"] },
	},
	render: Template,
};

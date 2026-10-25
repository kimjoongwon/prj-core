import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { useState } from "react";
import { RadioGroup as BoundRadioGroup } from "./index";
import { RadioGroup } from "./RadioGroup";

const meta: Meta<typeof RadioGroup> = {
	title: "input/RadioGroup",
	component: RadioGroup,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const createRadioGroupStoryState = () =>
	makeAutoObservable(
		{ choice: "2" },
		{},
		{ autoBind: true, name: "RadioGroupStoryState" },
	);

const options = [
	{ text: "Option 1", value: "1" },
	{ text: "Option 2", value: "2" },
	{ text: "Option 3", value: "3" },
];

export const Default: Story = {
	args: {
		label: "Select an option",
		options,
	},
	render: (args) => {
		const [value, setValue] = useState("");
		return <RadioGroup {...args} value={value} onValueChange={setValue} />;
	},
};

export const WithInitialValue: Story = {
	args: {
		label: "Select an option",
		options,
	},
	render: (args) => {
		const [value, setValue] = useState("2");
		return <RadioGroup {...args} value={value} onValueChange={setValue} />;
	},
};

export const ExternalState: Story = {
	args: { label: "외부 state 선택", options },
	render: () => {
		const state = useLocalObservable(createRadioGroupStoryState);
		return (
			<BoundRadioGroup
				label="외부 state 선택"
				options={options}
				state={state}
				path="choice"
			/>
		);
	},
};

import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { useState } from "react";
import { TextArea as BoundTextArea } from "./index";
import { TextArea } from "./TextArea";

const meta: Meta<typeof TextArea> = {
	title: "input/TextArea",
	component: TextArea,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const createTextAreaStoryState = () =>
	makeAutoObservable(
		{ description: "외부 state 연결 예시" },
		{},
		{ autoBind: true, name: "TextAreaStoryState" },
	);

export const Default: Story = {
	args: {
		label: "Description",
		placeholder: "Enter a description...",
	},
};

export const ExternalState: Story = {
	args: { label: "설명" },
	render: () => {
		const state = useLocalObservable(createTextAreaStoryState);
		return <BoundTextArea label="설명" state={state} path="description" />;
	},
};

export const WithInitialValue: Story = {
	args: {
		label: "Description",
	},
	render: (args) => {
		const [value, setValue] = useState("This is a default description.");
		return <TextArea {...args} value={value} onChange={setValue} />;
	},
};

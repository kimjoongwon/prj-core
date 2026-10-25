import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { TextField as BoundTextField, createTextFieldState } from "./index";
import { TextField } from "./TextField";

const meta: Meta<typeof TextField> = {
	title: "input/TextField",
	component: TextField,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const createTextFieldStoryState = () =>
	makeAutoObservable(
		{ email: "ops@example.com" },
		{},
		{ autoBind: true, name: "TextFieldStoryState" },
	);

const WithPrefixAndSuffixState = observer(
	({ args }: { args: Story["args"] }) => {
		const state = useLocalObservable(() => createTextFieldState(""));
		return (
			<TextField {...args} value={state.value} onValueChange={state.setValue} />
		);
	},
);

export const Default: Story = {
	args: {
		className: "w-80",
		description: "We'll never share this with anyone else.",
		label: "Email",
		placeholder: "Enter your email",
		type: "email",
	},
};

export const ExternalState: Story = {
	args: { label: "이메일", placeholder: "name@example.com" },
	render: () => {
		const state = useLocalObservable(createTextFieldStoryState);
		return (
			<BoundTextField
				label="이메일"
				placeholder="name@example.com"
				state={state}
				path="email"
			/>
		);
	},
};

export const WithPrefixAndSuffix: Story = {
	args: {
		className: "w-80",
		endContent: "USD",
		label: "Price",
		placeholder: "0",
		startContent: "$",
		type: "number",
		variant: "secondary",
	},
	render: (args) => <WithPrefixAndSuffixState args={args} />,
};

export const Invalid: Story = {
	args: {
		className: "w-80",
		errorMessage: "Please enter a valid email address.",
		isInvalid: true,
		label: "Email",
		placeholder: "name@example.com",
		type: "email",
		value: "wrong-email",
	},
};

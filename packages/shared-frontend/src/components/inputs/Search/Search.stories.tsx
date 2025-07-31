import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
import { Search } from "./Search";

const meta: Meta<typeof Search> = {
	title: "Inputs/Search",
	component: Search,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story['render'] = (args) => {
	const state = useLocalObservable(() => ({ query: args.state?.query || "" }));
	const queryState = useLocalObservable(() => ({ query: "" }));
	return <Search {...args} state={state} path="query" queryState={queryState} />;
};

export const Default: Story = {
	args: {
		state: { query: "" },
	},
	render: Template,
};

export const WithInitialValue: Story = {
	args: {
		state: { query: "initial search" },
	},
	render: Template,
};

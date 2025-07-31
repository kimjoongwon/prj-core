import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
import { DateRangePicker } from "./DateRangePicker";

const meta: Meta<typeof DateRangePicker> = {
	title: "Inputs/DateRangePicker",
	component: DateRangePicker,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
	render: (args) => {
		const state = useLocalObservable(() => ({
			startDate: new Date().toISOString(),
			endDate: new Date().toISOString(),
		}));

		return <DateRangePicker {...args} state={state} path={args.path} />;
	},
};

export const Default: Story = {
	...Template,
	args: {
		// @ts-ignore
		path: "startDate,endDate",
		label: "Date Range",
	},
};

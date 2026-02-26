import type { Meta, StoryObj } from "@storybook/react";
import { AssigneeSelect } from "./AssigneeSelect";

const meta: Meta<typeof AssigneeSelect> = {
	title: "Inputs/AssigneeSelect",
	component: AssigneeSelect,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AssigneeSelect>;

const mockAssignees = [
	{
		id: "1",
		name: "김상담",
		email: "agent1@example.com",
		role: "상담원",
	},
	{
		id: "2",
		name: "이매니저",
		email: "manager@example.com",
		role: "매니저",
	},
	{
		id: "3",
		name: "박팀장",
		email: "teamleader@example.com",
		role: "팀장",
	},
];

export const Default: Story = {
	args: {
		label: "담당자",
		assignees: mockAssignees,
		includeUnassigned: true,
	},
};

export const WithValue: Story = {
	args: {
		label: "담당자",
		assignees: mockAssignees,
		value: "1",
		includeUnassigned: true,
	},
};

export const WithoutUnassigned: Story = {
	args: {
		label: "담당자",
		assignees: mockAssignees,
		includeUnassigned: false,
	},
};

export const Disabled: Story = {
	args: {
		label: "담당자",
		assignees: mockAssignees,
		value: "2",
		isDisabled: true,
		includeUnassigned: true,
	},
};

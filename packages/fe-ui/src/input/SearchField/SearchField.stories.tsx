import type { Meta, StoryObj } from "@storybook/react";
import { SearchField } from "./SearchField";

const meta: Meta<typeof SearchField> = {
	title: "input/SearchField",
	component: SearchField,
	tags: ["autodocs"],
	argTypes: {
		children: {
			table: {
				disable: true,
			},
			control: false,
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		"aria-label": "검색",
		defaultValue: "storybook",
	},
	render: (args) => (
		<SearchField {...args}>
			<SearchField.Group>
				<SearchField.SearchIcon />
				<SearchField.Input placeholder="검색어 입력" />
				<SearchField.ClearButton />
			</SearchField.Group>
		</SearchField>
	),
};

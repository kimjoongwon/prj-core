import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
	title: "input/Pagination",
	component: Pagination,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Pagination>
			<Pagination.Summary>Showing 1-10 of 100 results</Pagination.Summary>
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.Previous>
						<Pagination.PreviousIcon />
						<span>Previous</span>
					</Pagination.Previous>
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Link isActive>1</Pagination.Link>
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Link>2</Pagination.Link>
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Ellipsis />
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Link>10</Pagination.Link>
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Next>
						<span>Next</span>
						<Pagination.NextIcon />
					</Pagination.Next>
				</Pagination.Item>
			</Pagination.Content>
		</Pagination>
	),
};

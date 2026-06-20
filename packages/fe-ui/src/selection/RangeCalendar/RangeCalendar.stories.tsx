import type { Meta, StoryObj } from "@storybook/react";
import { RangeCalendar } from "./RangeCalendar";

const meta: Meta<typeof RangeCalendar> = {
	title: "selection/RangeCalendar",
	component: RangeCalendar,
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
		"aria-label": "기간 선택",
	},
	render: (args) => (
		<RangeCalendar {...args}>
			<>
				<RangeCalendar.Header>
					<RangeCalendar.NavButton slot="previous" />
					<RangeCalendar.Heading />
					<RangeCalendar.NavButton slot="next" />
				</RangeCalendar.Header>
				<RangeCalendar.Grid>
					<RangeCalendar.GridHeader>
						{(day) => (
							<RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>
						)}
					</RangeCalendar.GridHeader>
					<RangeCalendar.GridBody>
						{(date) => (
							<RangeCalendar.Cell date={date}>
								{({ formattedDate }) => (
									<>
										{formattedDate}
										<RangeCalendar.CellIndicator />
									</>
								)}
							</RangeCalendar.Cell>
						)}
					</RangeCalendar.GridBody>
				</RangeCalendar.Grid>
			</>
		</RangeCalendar>
	),
};

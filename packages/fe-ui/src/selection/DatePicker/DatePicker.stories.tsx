import {
	Calendar as HeroCalendar,
	DateField as HeroDateField,
	DatePicker as HeroDatePicker,
} from "@heroui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
	title: "selection/DatePicker",
	component: DatePicker,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A date picker component built with HeroUI and React state management.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			description: "Selected date value",
			control: false,
		},
		onChange: {
			description: "Callback function when date changes",
			control: false,
		},
		children: {
			table: {
				disable: true,
			},
			control: false,
		},
		label: {
			description: "Label for the date picker",
			control: "text",
		},
		isDisabled: {
			description: "Whether the date picker is disabled",
			control: "boolean",
		},
		isReadOnly: {
			description: "Whether the date picker is read-only",
			control: "boolean",
		},
		isRequired: {
			description: "Whether the date picker is required",
			control: "boolean",
		},
		variant: {
			description: "Visual variant of the date picker",
			control: "select",
			options: ["flat", "bordered", "faded", "underlined"],
		},
		size: {
			description: "Size of the date picker",
			control: "select",
			options: ["sm", "md", "lg"],
		},
		color: {
			description: "Color theme of the date picker",
			control: "select",
			options: [
				"default",
				"primary",
				"secondary",
				"success",
				"warning",
				"danger",
			],
		},
		radius: {
			description: "Border radius of the date picker",
			control: "select",
			options: ["none", "sm", "md", "lg", "full"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		"aria-label": "기준일 선택",
		label: "기준일",
	},
	render: (args) => (
		<DatePicker {...args}>
			<HeroDateField.Group className="h-10 min-w-64">
				<HeroDateField.Input>
					{(segment) => <HeroDateField.Segment segment={segment} />}
				</HeroDateField.Input>
				<HeroDateField.Suffix className="pointer-events-auto mr-1">
					<HeroDatePicker.Trigger className="size-8 shrink-0 justify-center rounded-md p-0">
						<HeroDatePicker.TriggerIndicator />
					</HeroDatePicker.Trigger>
				</HeroDateField.Suffix>
			</HeroDateField.Group>
			<HeroDatePicker.Popover>
				<HeroCalendar aria-label="기준일 달력">
					<HeroCalendar.Header>
						<HeroCalendar.NavButton slot="previous" />
						<HeroCalendar.Heading />
						<HeroCalendar.NavButton slot="next" />
					</HeroCalendar.Header>
					<HeroCalendar.Grid>
						<HeroCalendar.GridHeader>
							{(day) => (
								<HeroCalendar.HeaderCell>{day}</HeroCalendar.HeaderCell>
							)}
						</HeroCalendar.GridHeader>
						<HeroCalendar.GridBody>
							{(date) => (
								<HeroCalendar.Cell date={date}>
									{({ formattedDate }) => (
										<>
											{formattedDate}
											<HeroCalendar.CellIndicator />
										</>
									)}
								</HeroCalendar.Cell>
							)}
						</HeroCalendar.GridBody>
					</HeroCalendar.Grid>
				</HeroCalendar>
			</HeroDatePicker.Popover>
		</DatePicker>
	),
};

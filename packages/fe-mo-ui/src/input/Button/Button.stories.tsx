import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { tv } from "tailwind-variants";
import { Button } from "./index";

const meta = {
	title: "input/Button",
	component: Button,
	args: {
		children: "예약 확인",
		size: "md",
		variant: "primary",
	},
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
		variant: {
			control: "select",
			options: [
				"primary",
				"secondary",
				"tertiary",
				"outline",
				"ghost",
				"danger",
				"danger-soft",
			],
		},
	},
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<View className={classNames.stack()}>
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="danger">Danger</Button>
		</View>
	),
};

const storyClassNames = tv({
	slots: {
		stack: "min-w-[220px] gap-3",
	},
});

const classNames = storyClassNames();

import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { tv } from "tailwind-variants";
import { Typography } from "../../data-display/Typography";
import { AnimatedTabIcon } from "./index";

const meta = {
	title: "icon/AnimatedTabIcon",
	component: AnimatedTabIcon,
	args: {
		color: "#2563eb",
		focused: true,
		name: "house",
		size: 24,
	},
	argTypes: {
		focused: {
			control: "boolean",
		},
		name: {
			control: "select",
			options: ["house", "calendarCheck", "userRound"],
		},
		size: {
			control: "number",
		},
	},
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof AnimatedTabIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BottomTabs: Story = {
	render: () => (
		<View className={classNames.tabs()}>
			{[
				{ label: "홈", name: "house" as const },
				{ label: "예약", name: "calendarCheck" as const },
				{ label: "내 정보", name: "userRound" as const },
			].map((item) => (
				<View className={classNames.tab()} key={item.name}>
					<AnimatedTabIcon
						color="#2563eb"
						focused
						name={item.name}
						size={24}
						strokeWidth={2}
					/>
					<Typography className={classNames.label()} type="body-sm">
						{item.label}
					</Typography>
				</View>
			))}
		</View>
	),
};

export const StaticFallback: Story = {
	args: {
		focused: false,
	},
};

const animatedTabIconStoryClassNames = tv({
	slots: {
		label: "text-[11px] font-extrabold text-accent",
		tab: "w-20 items-center justify-center gap-1",
		tabs: "w-[320px] flex-row items-center justify-around rounded-xl border border-border bg-surface px-5 py-4",
	},
});

const classNames = animatedTabIconStoryClassNames();

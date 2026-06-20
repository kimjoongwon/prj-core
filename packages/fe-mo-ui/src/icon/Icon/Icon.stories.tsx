import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { tv } from "tailwind-variants";
import { Text } from "../../data-display/Text";
import { Icon, type MobileIconName, mobileIcons } from "./index";

const iconNames = Object.keys(mobileIcons) as MobileIconName[];

const meta = {
	title: "icon/Icon",
	component: Icon,
	args: {
		name: "house",
		size: "lg",
		tone: "accent",
	},
	argTypes: {
		name: {
			control: "select",
			options: iconNames,
		},
		size: {
			control: "select",
			options: ["xs", "sm", "md", "lg"],
		},
		tone: {
			control: "select",
			options: [
				"accent",
				"accentForeground",
				"danger",
				"foreground",
				"muted",
				"success",
				"warning",
			],
		},
	},
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const GlyphGrid: Story = {
	render: () => (
		<ScrollView
			className={classNames.scroll()}
			contentContainerClassName={classNames.grid()}
			showsVerticalScrollIndicator={false}
		>
			{iconNames.map((name) => (
				<View className={classNames.item()} key={name}>
					<Icon name={name} size="lg" tone="foreground" />
					<Text className={classNames.label()} numberOfLines={1}>
						{name}
					</Text>
				</View>
			))}
		</ScrollView>
	),
};

const iconStoryClassNames = tv({
	slots: {
		grid: "w-[360px] flex-row flex-wrap gap-3 p-4",
		item: "h-20 w-[76px] items-center justify-center gap-2 rounded-lg border border-border bg-surface px-2",
		label: "text-center text-[10px] font-semibold leading-3 text-muted",
		scroll: "max-h-[640px]",
	},
});

const classNames = iconStoryClassNames();

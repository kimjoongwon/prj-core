import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";
import { ScrollView } from "./ScrollView";

const meta: Meta<typeof ScrollView> = {
	title: "ui/ScrollView",
	component: ScrollView,
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["default", "content1", "content2", "content3", "content4"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const DemoContent = () => (
	<>
		{Array.from({ length: 20 }, (_, index) => (
			<View
				key={index}
				style={{
					padding: 16,
					marginVertical: 8,
					marginHorizontal: 16,
					borderRadius: 8,
					backgroundColor: "rgba(0, 111, 238, 0.1)",
				}}
			>
				<Text variant="h6">Item {index + 1}</Text>
				<Text variant="body2" color="default">
					This is a demo content item to show the ScrollView component. It has
					enough content to demonstrate scrolling behavior.
				</Text>
			</View>
		))}
	</>
);

export const Default: Story = {
	render: (args) => (
		<ScrollView {...args} style={{ flex: 1 }}>
			<DemoContent />
		</ScrollView>
	),
	args: {
		variant: "default",
	},
};

export const Content1: Story = {
	render: (args) => (
		<ScrollView {...args} style={{ flex: 1 }}>
			<DemoContent />
		</ScrollView>
	),
	args: {
		variant: "content1",
	},
};

export const Content2: Story = {
	render: (args) => (
		<ScrollView {...args} style={{ flex: 1 }}>
			<DemoContent />
		</ScrollView>
	),
	args: {
		variant: "content2",
	},
};

export const Content3: Story = {
	render: (args) => (
		<ScrollView {...args} style={{ flex: 1 }}>
			<DemoContent />
		</ScrollView>
	),
	args: {
		variant: "content3",
	},
};

export const Content4: Story = {
	render: (args) => (
		<ScrollView {...args} style={{ flex: 1 }}>
			<DemoContent />
		</ScrollView>
	),
	args: {
		variant: "content4",
	},
};

export const WithHorizontalScrolling: Story = {
	render: (args) => (
		<ScrollView
			{...args}
			horizontal
			style={{ flex: 1 }}
			contentContainerStyle={{ flexDirection: "row", padding: 16 }}
		>
			{Array.from({ length: 10 }, (_, index) => (
				<View
					key={index}
					style={{
						width: 200,
						height: 150,
						padding: 16,
						marginRight: 16,
						borderRadius: 8,
						backgroundColor: "rgba(0, 111, 238, 0.1)",
					}}
				>
					<Text variant="h6">Card {index + 1}</Text>
					<Text variant="body2" color="default">
						Horizontal scrolling card content
					</Text>
				</View>
			))}
		</ScrollView>
	),
	args: {
		variant: "default",
	},
};

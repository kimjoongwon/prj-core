import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../Typography";
import { TagGroup } from "./index";

const meta = {
	title: "data-display/TagGroup",
	component: TagGroup,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof TagGroup>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Typography className="font-extrabold" type="h5">TagGroup</Typography>
				<Typography color="muted" type="body-sm">
					수업 태그, 필터 키워드, 선택 가능한 속성 묶음을 표시합니다.
				</Typography>
			</View>
			<TagGroup
				defaultSelectedKeys={["core", "reformer"]}
				selectionMode="multiple"
				variant="surface"
			>
				<TagGroup.List>
					<TagGroup.Item id="reformer">Reformer</TagGroup.Item>
					<TagGroup.Item id="core">Core</TagGroup.Item>
					<TagGroup.Item id="balance">Balance</TagGroup.Item>
					<TagGroup.Item id="stretch" isDisabled>
						Stretch
					</TagGroup.Item>
				</TagGroup.List>
			</TagGroup>
		</ScrollView>
	),
};

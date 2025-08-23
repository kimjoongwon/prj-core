import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import type { ListItemProps } from "@/components/ui/ListItem/ListItem";
import { ListItem } from "@/components/ui/ListItem/ListItem";

const meta: Meta<ListItemProps> = {
	title: "components/ListItem",
	component: ListItem,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"모던한 디자인의 ListItem 컴포넌트입니다. 다양한 변형과 크기, 애니메이션을 지원합니다.",
			},
		},
	},
	argTypes: {
		title: {
			control: { type: "text" },
			description: "제목",
		},
		description: {
			control: { type: "text" },
			description: "설명",
		},
		imageUrl: {
			control: { type: "text" },
			description: "이미지 URL",
		},
		variant: {
			control: { type: "select" },
			options: ["default", "card", "simple"],
			description: "리스트 아이템 변형",
		},
		size: {
			control: { type: "select" },
			options: ["sm", "md", "lg"],
			description: "리스트 아이템 크기",
		},
		showImage: {
			control: { type: "boolean" },
			description: "이미지 표시",
		},
	},
	decorators: [
		(Story) => (
			<View style={{ padding: 16, minWidth: 320 }}>
				<Story />
			</View>
		),
	],
};

export default meta;
type Story = StoryObj<ListItemProps>;

export const Default: Story = {
	args: {
		title: "React Native",
		description:
			"크로스 플랫폼 모바일 앱 개발 프레임워크로 iOS와 Android 앱을 동시에 개발할 수 있습니다.",
		imageUrl: "https://reactnative.dev/img/header_logo.svg",
	},
};
export const 이미지없음: Story = {
	args: {
		title: "React Native",
		description:
			"크로스 플랫폼 모바일 앱 개발 프레임워크로 iOS와 Android 앱을 동시에 개발할 수 있습니다.",
	},
};

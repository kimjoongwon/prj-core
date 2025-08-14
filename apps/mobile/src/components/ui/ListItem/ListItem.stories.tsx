import type { Meta, StoryObj } from "@storybook/react-native";
import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../Text";
import { ListItem } from "./ListItem";
import type { ListItemProps } from "./types";

// 샘플 데이터
const sampleItems = [
	{
		id: 1,
		title: "React Native",
		description: "크로스 플랫폼 모바일 앱 개발 프레임워크로 iOS와 Android 앱을 동시에 개발할 수 있습니다.",
		image: "https://reactnative.dev/img/header_logo.svg",
	},
	{
		id: 2,
		title: "TypeScript",
		description: "정적 타입 검사를 지원하는 JavaScript의 상위 집합",
	},
	{
		id: 3,
		title: "Design System",
		description: "일관된 사용자 경험을 위한 디자인 패턴과 컴포넌트 라이브러리",
		image: "https://via.placeholder.com/64/007bff/ffffff?text=DS",
	},
];

const meta: Meta<ListItemProps> = {
	title: "components/ListItem",
	component: ListItem,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "모던한 디자인의 ListItem 컴포넌트입니다. 다양한 변형과 크기, 애니메이션을 지원합니다.",
			},
		},
	},
	argTypes: {
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
		isSelected: {
			control: { type: "boolean" },
			description: "선택 상태",
		},
		showCheckbox: {
			control: { type: "boolean" },
			description: "체크박스 표시",
		},
		showImage: {
			control: { type: "boolean" },
			description: "이미지 표시",
		},
		showAnimation: {
			control: { type: "boolean" },
			description: "애니메이션 효과",
		},
		disabled: {
			control: { type: "boolean" },
			description: "비활성화 상태",
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
	render: (args) => (
		<ListItem {...args} item={sampleItems[0]} onPress={() => console.log("Item pressed")} />
	),
	args: {},
};

export const Selected: Story = {
	render: (args) => (
		<ListItem 
			{...args} 
			item={sampleItems[0]}
			isSelected={true}
			showCheckbox={true}
			onPress={() => console.log("Selected item pressed")}
		/>
	),
	args: {},
};

export const WithoutImage: Story = {
	render: (args) => (
		<ListItem {...args} item={sampleItems[1]} onPress={() => console.log("No image item pressed")} />
	),
	args: {},
};

export const CardVariant: Story = {
	render: (args) => (
		<ListItem 
			{...args} 
			item={sampleItems[2]}
			variant="card"
			onPress={() => console.log("Card variant pressed")}
		/>
	),
	args: {},
};

export const SimpleVariant: Story = {
	render: (args) => (
		<ListItem 
			{...args} 
			item={sampleItems[0]}
			variant="simple"
			onPress={() => console.log("Simple variant pressed")}
		/>
	),
	args: {},
};

export const SmallSize: Story = {
	render: (args) => (
		<ListItem 
			{...args} 
			item={{
				id: 4,
				title: "작은 사이즈",
				description: "작은 크기의 리스트 아이템",
			}}
			size="sm"
			onPress={() => console.log("Small size pressed")}
		/>
	),
	args: {},
};

export const LargeSize: Story = {
	render: (args) => (
		<ListItem 
			{...args} 
			item={sampleItems[0]}
			size="lg"
			showCheckbox={true}
			onPress={() => console.log("Large size pressed")}
		/>
	),
	args: {},
};

export const WithStartContent: Story = {
	render: (args) => (
		<ListItem
			{...args}
			item={sampleItems[1]}
			showImage={false}
			startContent={
				<View style={{ 
					width: 40, 
					height: 40, 
					backgroundColor: "#007bff20", 
					borderRadius: 20, 
					justifyContent: "center", 
					alignItems: "center" 
				}}>
					<Ionicons name="code" size={20} color="#007bff" />
				</View>
			}
			onPress={() => console.log("With start content pressed")}
		/>
	),
	args: {},
};

export const WithEndContent: Story = {
	render: (args) => (
		<ListItem
			{...args}
			item={sampleItems[2]}
			endContent={
				<View style={{ flexDirection: "row", gap: 8 }}>
					<View style={{
						backgroundColor: "#28a74520",
						paddingHorizontal: 8,
						paddingVertical: 4,
						borderRadius: 12,
					}}>
						<Text style={{ color: "#28a745", fontSize: 12, fontWeight: "600" }}>
							NEW
						</Text>
					</View>
					<Ionicons name="chevron-forward" size={16} color="#666" />
				</View>
			}
			onPress={() => console.log("With end content pressed")}
		/>
	),
	args: {},
};

export const Disabled: Story = {
	render: (args) => (
		<ListItem 
			{...args} 
			item={sampleItems[0]}
			disabled={true}
			showCheckbox={true}
			onPress={() => console.log("This should not fire")}
		/>
	),
	args: {},
};

export const AllVariants: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
				All Variants
			</Text>
			
			<View style={{ gap: 12 }}>
				<ListItem
					item={sampleItems[0]}
					variant="default"
					onPress={() => console.log("Default pressed")}
				/>
				<ListItem
					item={sampleItems[1]}
					variant="card"
					showCheckbox={true}
					onPress={() => console.log("Card pressed")}
				/>
				<ListItem
					item={sampleItems[2]}
					variant="simple"
					isSelected={true}
					onPress={() => console.log("Simple pressed")}
				/>
			</View>
		</View>
	),
	args: {},
};

export const AllSizes: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
				All Sizes
			</Text>
			
			<View style={{ gap: 12 }}>
				<ListItem
					item={{ id: 1, title: "Small Size", description: "sm 크기의 아이템" }}
					size="sm"
					showCheckbox={true}
					onPress={() => console.log("Small pressed")}
				/>
				<ListItem
					item={{ id: 2, title: "Medium Size", description: "md 크기의 아이템 (기본값)" }}
					size="md"
					showCheckbox={true}
					isSelected={true}
					onPress={() => console.log("Medium pressed")}
				/>
				<ListItem
					item={{ id: 3, title: "Large Size", description: "lg 크기의 아이템으로 더 많은 정보를 표시할 수 있습니다." }}
					size="lg"
					showCheckbox={true}
					onPress={() => console.log("Large pressed")}
				/>
			</View>
		</View>
	),
	args: {},
};

export const DynamicContent: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
				Dynamic Content Layout
			</Text>
			
			<View style={{ gap: 12 }}>
				<ListItem
					item={{ 
						id: 1, 
						title: "이미지와 설명 모두 있음",
						description: "이미지와 설명이 모두 있는 경우의 레이아웃",
						image: "https://via.placeholder.com/48/007bff/ffffff?text=IMG"
					}}
					onPress={() => console.log("Full content pressed")}
				/>
				<ListItem
					item={{ 
						id: 2, 
						title: "이미지 없음 (플레이스홀더도 없음)",
						description: "item.image가 없으면 이미지 영역이 완전히 제거됩니다"
					}}
					showImage={true}
					onPress={() => console.log("No image pressed")}
				/>
				<ListItem
					item={{ 
						id: 3, 
						title: "showImage=false로 이미지 숨김",
						description: "showImage가 false면 이미지 영역이 숨겨집니다"
					}}
					showImage={false}
					onPress={() => console.log("Image hidden pressed")}
				/>
				<ListItem
					item={{ 
						id: 4, 
						title: "제목만 있음 (이미지와 설명 모두 없음)" 
					}}
					showImage={false}
					onPress={() => console.log("Title only pressed")}
				/>
				<ListItem
					item={{ 
						id: 5, 
						title: "매우 긴 제목이 있는 경우로 텍스트가 길어질 때 어떻게 처리되는지 확인",
						description: "긴 제목과 함께 설명도 있는 경우의 레이아웃 처리 방식을 보여줍니다."
					}}
					showCheckbox={true}
					endContent={
						<View style={{ width: 24, height: 24, backgroundColor: "#f0f0f0", borderRadius: 12 }} />
					}
					onPress={() => console.log("Long text pressed")}
				/>
			</View>
		</View>
	),
	args: {},
};
import type { Meta, StoryObj } from "@storybook/react-native";
import React from "react";
import { View } from "react-native";
import { Text } from "../Text";
import { SearchAndSelect } from "./SearchAndSelect";
import type { SearchAndSelectProps, SearchAndSelectItem } from "./types";

// 샘플 데이터
const sampleItems: SearchAndSelectItem[] = [
	{
		id: 1,
		title: "React Native",
		description: "크로스 플랫폼 모바일 앱 개발 프레임워크",
		image: "https://reactnative.dev/img/header_logo.svg",
	},
	{
		id: 2,
		title: "TypeScript",
		description: "정적 타입 검사를 지원하는 JavaScript의 상위 집합",
	},
	{
		id: 3,
		title: "React",
		description: "사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리",
		image: "https://reactjs.org/logo-og.png",
	},
	{
		id: 4,
		title: "Node.js",
		description: "Chrome V8 엔진으로 빌드된 JavaScript 런타임",
	},
	{
		id: 5,
		title: "Next.js",
		description: "React를 위한 프로덕션 급 풀스택 프레임워크",
		image: "https://nextjs.org/static/favicon/safari-pinned-tab.svg",
	},
	{
		id: 6,
		title: "Vue.js",
		description: "점진적으로 채택 가능한 JavaScript 프레임워크",
	},
	{
		id: 7,
		title: "Angular",
		description: "TypeScript 기반의 웹 애플리케이션 프레임워크",
	},
	{
		id: 8,
		title: "Svelte",
		description: "컴파일 타임에 최적화되는 웹 프레임워크",
	},
];

const handleValueChange = (
	selectedItems: SearchAndSelectItem[],
	selectedIds: (string | number)[],
) => {
	console.log("Selected items:", selectedItems);
	console.log("Selected IDs:", selectedIds);
};

const meta: Meta<SearchAndSelectProps> = {
	title: "components/SearchAndSelect",
	component: SearchAndSelect,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"구글 스타일 검색창이 적용된 SearchAndSelect 컴포넌트입니다. 검색, 필터링, 다중 선택 기능을 제공하며, 아이콘과 클리어 버튼이 포함된 모던한 검색 UI를 제공합니다.",
			},
		},
	},
	argTypes: {
		selectionMode: {
			control: { type: "select" },
			options: ["single", "multiple"],
			description: "선택 모드 (단일/다중)",
		},
		searchPlaceholder: {
			control: { type: "text" },
			description: "검색창 플레이스홀더",
		},
		disabled: {
			control: { type: "boolean" },
			description: "비활성화 상태",
		},
		maxSelections: {
			control: { type: "number" },
			description: "최대 선택 개수 (다중 선택시)",
		},
	},
	decorators: [
		(Story) => (
			<View style={{ padding: 16, height: 400 }}>
				<Story />
			</View>
		),
	],
};

export default meta;
type Story = StoryObj<SearchAndSelectProps>;

export const Single: Story = {
	args: {
		items: sampleItems,
		onValueChange: handleValueChange,
		selectionMode: "single",
		searchPlaceholder: "기술을 검색하세요...",
	},
};

export const Multiple: Story = {
	args: {
		items: sampleItems,
		onValueChange: handleValueChange,
		selectionMode: "multiple",
		searchPlaceholder: "여러 기술을 선택하세요...",
	},
};

export const WithDefaultSelection: Story = {
	args: {
		items: sampleItems,
		onValueChange: handleValueChange,
		selectionMode: "multiple",
		searchPlaceholder: "기본 선택된 항목이 있습니다",
		defaultSelectedIds: [1, 3],
	},
};

export const WithMaxSelections: Story = {
	args: {
		items: sampleItems,
		onValueChange: handleValueChange,
		selectionMode: "multiple",
		searchPlaceholder: "최대 3개까지 선택 가능",
		maxSelections: 3,
	},
};

export const Disabled: Story = {
	args: {
		items: sampleItems,
		onValueChange: handleValueChange,
		selectionMode: "multiple",
		searchPlaceholder: "비활성화된 상태",
		defaultSelectedIds: [1, 2],
		disabled: true,
	},
};

export const CustomSearch: Story = {
	args: {
		items: sampleItems,
		onValueChange: handleValueChange,
		selectionMode: "single",
		searchPlaceholder: "커스텀 검색 로직",
		onSearch: (query: string, items: SearchAndSelectItem[]) => {
			// 커스텀 검색 로직: 제목과 설명에서 더 정확한 매칭
			const lowerQuery = query.toLowerCase();
			return items
				.filter((item) => {
					const titleMatch = item.title.toLowerCase().includes(lowerQuery);
					const descMatch = item.description
						?.toLowerCase()
						.includes(lowerQuery);
					// 제목에 완전히 매칭되는 경우 우선순위
					const exactMatch = item.title.toLowerCase() === lowerQuery;
					return exactMatch || titleMatch || descMatch;
				})
				.sort((a, b) => {
					// 제목 매칭 우선, 그 다음 설명 매칭
					const aTitle = a.title.toLowerCase().includes(lowerQuery);
					const bTitle = b.title.toLowerCase().includes(lowerQuery);
					if (aTitle && !bTitle) return -1;
					if (!aTitle && bTitle) return 1;
					return 0;
				});
		},
	},
};

export const EmptyState: Story = {
	args: {
		items: [],
		onValueChange: handleValueChange,
		selectionMode: "single",
		searchPlaceholder: "빈 목록 상태",
	},
};

export const WithoutImages: Story = {
	args: {
		items: sampleItems.map((item) => ({ ...item, image: undefined })),
		onValueChange: handleValueChange,
		selectionMode: "multiple",
		searchPlaceholder: "이미지가 없는 아이템들",
	},
};

// 제너릭 타입 테스트를 위한 커스텀 인터페이스
interface CustomItem {
	id: number;
	title: string;
	description?: string;
	category: string;
	priority: "high" | "medium" | "low";
}

const customItems: CustomItem[] = [
	{
		id: 1,
		title: "긴급 회의",
		description: "프로젝트 킥오프 미팅",
		category: "업무",
		priority: "high",
	},
	{
		id: 2,
		title: "점심 약속",
		description: "동료와 식사",
		category: "개인",
		priority: "medium",
	},
	{
		id: 3,
		title: "운동",
		category: "건강",
		priority: "low",
	},
];

export const CustomTypeExample: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<View>
				<Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
					🔧 커스텀 타입 예제
				</Text>
				<Text style={{ fontSize: 14, marginBottom: 8, opacity: 0.7 }}>
					제너릭을 사용하여 커스텀 아이템 타입도 지원합니다.
				</Text>
			</View>
			<SearchAndSelect<CustomItem>
				items={customItems}
				onValueChange={(selectedItems, selectedIds) => {
					console.log("Custom items:", selectedItems);
					// 여기서 selectedItems는 CustomItem[] 타입으로 추론됩니다
					selectedItems.forEach((item) => {
						console.log(
							`${item.title} - Priority: ${item.priority}, Category: ${item.category}`,
						);
					});
				}}
				selectionMode="multiple"
				searchPlaceholder="일정을 검색해보세요..."
				renderCustomItem={(item, isSelected) => (
					<View
						style={{
							padding: 16,
							backgroundColor: isSelected ? "#e3f2fd" : "#f5f5f5",
							borderRadius: 8,
							marginBottom: 8,
						}}
					>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Text style={{ fontSize: 16, fontWeight: "600" }}>
								{item.title}
							</Text>
							<View
								style={{
									backgroundColor:
										item.priority === "high"
											? "#f44336"
											: item.priority === "medium"
												? "#ff9800"
												: "#4caf50",
									paddingHorizontal: 8,
									paddingVertical: 4,
									borderRadius: 12,
								}}
							>
								<Text
									style={{ color: "white", fontSize: 12, fontWeight: "600" }}
								>
									{item.priority.toUpperCase()}
								</Text>
							</View>
						</View>
						{item.description && (
							<Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
								{item.description}
							</Text>
						)}
						<Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
							카테고리: {item.category}
						</Text>
					</View>
				)}
			/>
		</View>
	),
	args: {},
};

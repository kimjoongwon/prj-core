import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import type { ListProps } from "@/components/ui/List/List";
import { List } from "@/components/ui/List/List";
import { Text } from "@/components/ui/Text";

const meta: Meta<ListProps<any>> = {
	title: "components/List",
	component: List,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"수직 또는 수평으로 아이템을 렌더링할 수 있는 React Native 리스트 컴포넌트입니다. ScrollView 기반으로 스크롤을 지원합니다.",
			},
		},
	},
	argTypes: {
		data: {
			description: "렌더링할 데이터 아이템 배열",
		},
		renderItem: {
			description: "각 아이템을 렌더링할 함수 (item, index) => ReactNode",
		},
		horizontal: {
			control: { type: "boolean" },
			description: "수평 레이아웃 여부 (기본값: false)",
		},
		placeholder: {
			description: "리스트가 비어있을 때 보여줄 콘텐츠",
		},
		gap: {
			control: { type: "number" },
			description: "아이템 간의 간격 (픽셀)",
		},
		showsHorizontalScrollIndicator: {
			control: { type: "boolean" },
			description: "수평 스크롤 인디케이터 표시 여부",
		},
		showsVerticalScrollIndicator: {
			control: { type: "boolean" },
			description: "수직 스크롤 인디케이터 표시 여부",
		},
	},
	decorators: [
		(Story) => (
			<View style={{ padding: 16, minWidth: 320, minHeight: 200 }}>
				<Story />
			</View>
		),
	],
};

export default meta;
type Story = StoryObj<ListProps<any>>;

// 샘플 데이터
const 샘플아이템들 = [
	{ id: 1, name: "사과", type: "과일", color: "#FF6B6B" },
	{ id: 2, name: "바나나", type: "과일", color: "#FFE66D" },
	{ id: 3, name: "당근", type: "채소", color: "#FF8E53" },
	{ id: 4, name: "브로콜리", type: "채소", color: "#4ECDC4" },
	{ id: 5, name: "포도", type: "과일", color: "#9B59B6" },
];

const 샘플사용자들 = [
	{ id: 1, name: "홍길동", email: "hong@example.com", role: "관리자" },
	{ id: 2, name: "김철수", email: "kim@example.com", role: "사용자" },
	{ id: 3, name: "이영희", email: "lee@example.com", role: "편집자" },
];

export const 수직_리스트: Story = {
	args: {
		data: 샘플아이템들,
		horizontal: false,
		gap: 8,
	},
	render: (args) => (
		<List
			{...args}
			renderItem={(item, index) => (
				<View
					style={{
						padding: 16,
						backgroundColor: "#f8f9fa",
						borderRadius: 8,
						borderWidth: 1,
						borderColor: "#e9ecef",
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
						<Text style={{ fontSize: 12, opacity: 0.6 }}>#{index + 1}</Text>
						<View
							style={{
								width: 12,
								height: 12,
								borderRadius: 6,
								backgroundColor: item.color,
							}}
						/>
					</View>
					<Text style={{ fontWeight: "600", marginTop: 4 }}>{item.name}</Text>
					<Text style={{ fontSize: 12, opacity: 0.8 }}>{item.type}</Text>
				</View>
			)}
		/>
	),
	parameters: {
		docs: {
			description: {
				story:
					"수직으로 배열된 기본 리스트입니다. 스크롤 가능하며 인덱스도 함께 표시됩니다.",
			},
		},
	},
};

export const 수평_리스트: Story = {
	args: {
		data: 샘플아이템들,
		horizontal: true,
		gap: 12,
		showsHorizontalScrollIndicator: true,
	},
	render: (args) => (
		<List
			{...args}
			style={{ height: 120 }}
			renderItem={(item, index) => (
				<View
					style={{
						width: 120,
						padding: 12,
						backgroundColor: "#f8f9fa",
						borderRadius: 8,
						borderWidth: 1,
						borderColor: "#e9ecef",
						alignItems: "center",
					}}
				>
					<Text style={{ fontSize: 10, opacity: 0.6, marginBottom: 4 }}>
						#{index + 1}
					</Text>
					<View
						style={{
							width: 20,
							height: 20,
							borderRadius: 10,
							backgroundColor: item.color,
							marginBottom: 6,
						}}
					/>
					<Text
						style={{ fontWeight: "600", fontSize: 12, textAlign: "center" }}
					>
						{item.name}
					</Text>
					<Text style={{ fontSize: 10, opacity: 0.8, textAlign: "center" }}>
						{item.type}
					</Text>
				</View>
			)}
		/>
	),
	parameters: {
		docs: {
			description: {
				story:
					"수평으로 스크롤 가능한 리스트입니다. 고정 폭 아이템으로 구성됩니다.",
			},
		},
	},
};

export const 사용자_리스트: Story = {
	args: {
		data: 샘플사용자들,
		horizontal: false,
		gap: 12,
	},
	render: (args) => (
		<List
			{...args}
			renderItem={(user, index) => (
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						padding: 16,
						backgroundColor: "#f8f9fa",
						borderRadius: 8,
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
						<View
							style={{
								width: 32,
								height: 32,
								borderRadius: 16,
								backgroundColor: "#007AFF",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text style={{ color: "white", fontWeight: "600", fontSize: 12 }}>
								{index + 1}
							</Text>
						</View>
						<View>
							<Text style={{ fontWeight: "600", fontSize: 16 }}>
								{user.name}
							</Text>
							<Text style={{ fontSize: 12, opacity: 0.6 }}>{user.email}</Text>
						</View>
					</View>
					<View
						style={{
							paddingHorizontal: 8,
							paddingVertical: 4,
							backgroundColor: "#E3F2FD",
							borderRadius: 12,
						}}
					>
						<Text style={{ fontSize: 10, color: "#1976D2" }}>{user.role}</Text>
					</View>
				</View>
			)}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: "번호와 함께 사용자 정보를 표시하는 수직 리스트입니다.",
			},
		},
	},
};

export const 빈_리스트: Story = {
	args: {
		data: [],
		horizontal: false,
	},
	render: (args) => (
		<List
			{...args}
			renderItem={(item: any, _index) => (
				<View style={{ padding: 8, borderWidth: 1, borderRadius: 4 }}>
					<Text>{item.name}</Text>
				</View>
			)}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: "커스텀 플레이스홀더 콘텐츠를 보여주는 빈 리스트입니다.",
			},
		},
	},
};

export const 간격_설정_예제: Story = {
	args: {
		data: [
			{ id: 1, text: "간격 작음" },
			{ id: 2, text: "간격 중간" },
			{ id: 3, text: "간격 큼" },
		],
		horizontal: false,
		gap: 24,
	},
	render: (args) => (
		<View>
			<Text style={{ marginBottom: 16, fontWeight: "600" }}>
				Gap: {args.gap}px
			</Text>
			<List
				{...args}
				renderItem={(item, index) => (
					<View
						style={{
							padding: 16,
							backgroundColor: "#E3F2FD",
							borderLeftWidth: 4,
							borderLeftColor: "#2196F3",
							borderRadius: 4,
						}}
					>
						<Text style={{ fontWeight: "600" }}>아이템 {index + 1}</Text>
						<Text style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
							{item.text}
						</Text>
					</View>
				)}
			/>
		</View>
	),
	parameters: {
		docs: {
			description: {
				story: "gap 속성을 사용하여 아이템 간의 간격을 조절할 수 있습니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {
		data: 샘플아이템들,
		horizontal: false,
		gap: 8,
		showsVerticalScrollIndicator: true,
		showsHorizontalScrollIndicator: true,
	},
	render: (args) => (
		<List
			{...args}
			style={{ maxHeight: 300 }}
			renderItem={(item, index) => (
				<View
					style={{
						padding: 16,
						backgroundColor: "white",
						borderRadius: 8,
						borderWidth: 1,
						borderColor: "#e9ecef",
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.1,
						shadowRadius: 2,
						elevation: 2,
					}}
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
						>
							<View
								style={{
									width: 12,
									height: 12,
									borderRadius: 6,
									backgroundColor: item.color,
								}}
							/>
							<View>
								<Text style={{ fontWeight: "600" }}>{item.name}</Text>
								<Text style={{ fontSize: 12, opacity: 0.6 }}>{item.type}</Text>
							</View>
						</View>
						<Text style={{ fontSize: 10, opacity: 0.4 }}>#{index + 1}</Text>
					</View>
				</View>
			)}
		/>
	),
	parameters: {
		docs: {
			description: {
				story:
					"다양한 리스트 설정을 테스트할 수 있는 플레이그라운드입니다. Controls 패널에서 속성을 변경해보세요.",
			},
		},
	},
};

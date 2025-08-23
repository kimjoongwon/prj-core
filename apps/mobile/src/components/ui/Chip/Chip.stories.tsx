import { Ionicons } from "@expo/vector-icons";
import type { Meta, StoryObj } from "@storybook/react-native";
import { Image, View } from "react-native";
import type { ChipProps } from "@/components/ui/Chip/Chip";
import { Chip } from "@/components/ui/Chip/Chip";
import { Text } from "@/components/ui/Text";

const meta: Meta<ChipProps> = {
	title: "components/Chip",
	component: Chip,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"모던한 디자인의 정적 Chip 컴포넌트입니다. 다양한 변형, 색상, 크기를 지원하며 UI 표시 역할만 합니다.",
			},
		},
	},
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["solid", "bordered", "light", "flat", "faded", "shadow"],
			description: "칩 변형",
		},
		color: {
			control: { type: "select" },
			options: [
				"default",
				"primary",
				"secondary",
				"success",
				"warning",
				"danger",
			],
			description: "칩 색상",
		},
		size: {
			control: { type: "select" },
			options: ["sm", "md", "lg"],
			description: "칩 크기",
		},
		radius: {
			control: { type: "select" },
			options: ["none", "sm", "md", "lg", "full"],
			description: "모서리 둥글기",
		},
		isDisabled: {
			control: { type: "boolean" },
			description: "비활성화 상태",
		},
		children: {
			control: { type: "text" },
			description: "칩 내용",
		},
	},
	decorators: [
		(Story) => (
			<View style={{ padding: 16, alignItems: "flex-start" }}>
				<Story />
			</View>
		),
	],
};

export default meta;
type Story = StoryObj<ChipProps>;

export const Default: Story = {
	args: {
		children: "Default Chip",
	},
};

export const WithEndContent: Story = {
	render: (args) => (
		<Chip
			{...args}
			variant="bordered"
			color="danger"
			endContent={<Ionicons name="close" size={14} color="#f31260" />}
		>
			With End Content
		</Chip>
	),
	args: {},
};

export const WithStartIcon: Story = {
	render: (args) => (
		<Chip
			{...args}
			variant="solid"
			color="primary"
			startContent={<Ionicons name="star" size={16} color="white" />}
		>
			With Icon
		</Chip>
	),
	args: {},
};

export const WithEndIcon: Story = {
	render: (args) => (
		<Chip
			{...args}
			variant="bordered"
			color="secondary"
			endContent={<Ionicons name="arrow-forward" size={14} color="#7828c8" />}
		>
			With End Icon
		</Chip>
	),
	args: {},
};

export const WithAvatar: Story = {
	render: (args) => (
		<Chip
			{...args}
			variant="light"
			color="success"
			avatar={
				<Image
					source={{ uri: "https://i.pravatar.cc/40?img=1" }}
					style={{ width: 20, height: 20, borderRadius: 10 }}
				/>
			}
		>
			John Doe
		</Chip>
	),
	args: {},
};

export const AllVariants: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Text style={{ fontSize: 18, fontWeight: "bold" }}>All Variants</Text>
			<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
				<Chip variant="solid" color="primary">
					Solid
				</Chip>
				<Chip variant="bordered" color="primary">
					Bordered
				</Chip>
				<Chip variant="light" color="primary">
					Light
				</Chip>
				<Chip variant="flat" color="primary">
					Flat
				</Chip>
				<Chip variant="faded" color="primary">
					Faded
				</Chip>
				<Chip variant="shadow" color="primary">
					Shadow
				</Chip>
			</View>
		</View>
	),
	args: {},
};

export const AllColors: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Text style={{ fontSize: 18, fontWeight: "bold" }}>All Colors</Text>
			<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
				<Chip color="default">Default</Chip>
				<Chip color="primary">Primary</Chip>
				<Chip color="secondary">Secondary</Chip>
				<Chip color="success">Success</Chip>
				<Chip color="warning">Warning</Chip>
				<Chip color="danger">Danger</Chip>
			</View>
		</View>
	),
	args: {},
};

export const AllSizes: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Text style={{ fontSize: 18, fontWeight: "bold" }}>All Sizes</Text>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
				<Chip size="sm" color="primary">
					Small
				</Chip>
				<Chip size="md" color="primary">
					Medium
				</Chip>
				<Chip size="lg" color="primary">
					Large
				</Chip>
			</View>
		</View>
	),
	args: {},
};

export const AllRadius: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Text style={{ fontSize: 18, fontWeight: "bold" }}>All Radius</Text>
			<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
				<Chip radius="none" color="primary">
					None
				</Chip>
				<Chip radius="sm" color="primary">
					Small
				</Chip>
				<Chip radius="md" color="primary">
					Medium
				</Chip>
				<Chip radius="lg" color="primary">
					Large
				</Chip>
				<Chip radius="full" color="primary">
					Full
				</Chip>
			</View>
		</View>
	),
	args: {},
};

export const WithContentExamples: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Text style={{ fontSize: 18, fontWeight: "bold" }}>Content Examples</Text>
			<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
				<Chip variant="solid" color="primary">
					Solid Chip
				</Chip>
				<Chip
					variant="bordered"
					color="danger"
					endContent={<Ionicons name="close" size={14} color="#f31260" />}
				>
					With Close Icon
				</Chip>
				<Chip
					variant="light"
					color="success"
					startContent={<Ionicons name="checkmark" size={14} color="#17c964" />}
				>
					Success Status
				</Chip>
				<Chip
					variant="flat"
					color="warning"
					avatar={
						<View
							style={{
								width: 16,
								height: 16,
								backgroundColor: "#f5a524",
								borderRadius: 8,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text
								style={{ color: "white", fontSize: 10, fontWeight: "bold" }}
							>
								!
							</Text>
						</View>
					}
				>
					Warning
				</Chip>
			</View>
		</View>
	),
	args: {},
};

export const Disabled: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Text style={{ fontSize: 18, fontWeight: "bold" }}>Disabled States</Text>
			<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
				<Chip isDisabled>Disabled</Chip>
				<Chip isDisabled color="primary">
					Disabled Primary
				</Chip>
				<Chip
					isDisabled
					color="success"
					endContent={<Ionicons name="close" size={14} color="#17c964" />}
				>
					Disabled with Icon
				</Chip>
				<Chip
					isDisabled
					color="danger"
					startContent={<Ionicons name="close" size={14} color="#f31260" />}
				>
					Disabled Icon
				</Chip>
			</View>
		</View>
	),
	args: {},
};

export const RealWorldExamples: Story = {
	render: () => (
		<View style={{ gap: 24 }}>
			<View>
				<Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
					기술 스택
				</Text>
				<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
					<Chip size="sm" variant="flat" color="primary">
						React Native
					</Chip>
					<Chip size="sm" variant="flat" color="secondary">
						TypeScript
					</Chip>
					<Chip size="sm" variant="flat" color="success">
						Node.js
					</Chip>
					<Chip size="sm" variant="flat" color="warning">
						Expo
					</Chip>
				</View>
			</View>

			<View>
				<Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
					선택된 필터
				</Text>
				<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
					<Chip
						variant="solid"
						color="primary"
						endContent={<Ionicons name="close" size={14} color="white" />}
					>
						React
					</Chip>
					<Chip
						variant="solid"
						color="primary"
						endContent={<Ionicons name="close" size={14} color="white" />}
					>
						Mobile
					</Chip>
					<Chip
						variant="solid"
						color="primary"
						endContent={<Ionicons name="close" size={14} color="white" />}
					>
						UI/UX
					</Chip>
				</View>
			</View>

			<View>
				<Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
					상태 표시
				</Text>
				<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
					<Chip variant="light" color="success">
						<Text>● </Text>Active
					</Chip>
					<Chip variant="light" color="warning">
						<Text>● </Text>Pending
					</Chip>
					<Chip variant="light" color="danger">
						<Text>● </Text>Inactive
					</Chip>
					<Chip variant="light" color="default">
						<Text>● </Text>Unknown
					</Chip>
				</View>
			</View>
		</View>
	),
	args: {},
};

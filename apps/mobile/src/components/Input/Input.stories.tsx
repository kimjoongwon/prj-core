import type { Meta, StoryObj } from "@storybook/react-native";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Input, InputRef, InputProps } from "./Input";
import { useTheme } from "../providers/theme-provider";

// Extended args interface for Storybook
interface InputStoryArgs extends InputProps {
	startIcon?: keyof typeof iconMapping;
	endIcon?: keyof typeof iconMapping;
}

// Icon mapping for args
const iconMapping = {
	none: undefined,
	mail: <Ionicons name="mail" size={16} color="#666" />,
	eye: <Ionicons name="eye" size={16} color="#666" />,
	search: <Ionicons name="search" size={16} color="#666" />,
	person: <Ionicons name="person" size={16} color="#666" />,
	lock: <Ionicons name="lock-closed" size={16} color="#666" />,
};

const meta: Meta<InputStoryArgs> = {
	title: "Components/Input",
	component: Input,
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["flat", "bordered", "underlined", "faded"],
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
		},
		size: {
			control: { type: "select" },
			options: ["sm", "md", "lg"],
		},
		labelPlacement: {
			control: { type: "select" },
			options: ["inside", "outside", "outside-left"],
		},
		startIcon: {
			control: { type: "select" },
			options: ["none", "mail", "search", "person", "lock"],
			mapping: iconMapping,
		},
		endIcon: {
			control: { type: "select" },
			options: ["none", "eye", "search"],
			mapping: iconMapping,
		},
		isDisabled: {
			control: { type: "boolean" },
		},
		isReadOnly: {
			control: { type: "boolean" },
		},
		isInvalid: {
			control: { type: "boolean" },
		},
		isRequired: {
			control: { type: "boolean" },
		},
		isClearable: {
			control: { type: "boolean" },
		},
	},
	decorators: [
		(Story, { args }) => (
			<View style={{ padding: 16 }}>
				<Story
					args={{
						...args,
						startContent: args.startIcon || undefined,
						endContent: args.endIcon || undefined,
					}}
				/>
			</View>
		),
	],
};

export default meta;

type Story = StoryObj<InputStoryArgs>;

export const Default: Story = {
	args: {
		label: "Email",
		placeholder: "Enter your email",
		variant: "flat",
		color: "default",
		size: "md",
		labelPlacement: "inside",
	},
};

export const Flat: Story = {
	args: {
		label: "Flat Input",
		placeholder: "Enter text",
		variant: "flat",
		color: "primary",
		size: "md",
		labelPlacement: "inside",
	},
};

export const Bordered: Story = {
	args: {
		label: "Bordered Input",
		placeholder: "Enter text",
		variant: "bordered",
		color: "primary",
		size: "md",
		labelPlacement: "inside",
	},
};

export const Underlined: Story = {
	args: {
		label: "Underlined Input",
		placeholder: "Enter text",
		variant: "underlined",
		color: "primary",
		size: "md",
		labelPlacement: "inside",
	},
};

export const Faded: Story = {
	args: {
		label: "Faded Input",
		placeholder: "Enter text",
		variant: "faded",
		color: "primary",
		size: "md",
		labelPlacement: "inside",
	},
};

export const WithStartContent: Story = {
	args: {
		label: "Email",
		placeholder: "Enter your email",
		variant: "bordered",
		color: "primary",
		size: "md",
		labelPlacement: "inside",
		startIcon: "mail",
	},
};

export const WithEndContent: Story = {
	args: {
		label: "Password",
		placeholder: "Enter your password",
		variant: "bordered",
		color: "primary",
		size: "md",
		labelPlacement: "inside",
		secureTextEntry: true,
		endIcon: "eye",
	},
};

export const Clearable: Story = {
	args: {
		label: "Search",
		placeholder: "Search something",
		variant: "bordered",
		color: "primary",
		size: "md",
		labelPlacement: "inside",
		isClearable: true,
	},
};

export const OutsideLabel: Story = {
	args: {
		label: "Outside Label",
		placeholder: "Enter text",
		variant: "bordered",
		color: "primary",
		size: "md",
		labelPlacement: "outside",
	},
};

export const OutsideLeftLabel: Story = {
	args: {
		label: "Name",
		placeholder: "Enter your name",
		variant: "bordered",
		color: "primary",
		size: "md",
		labelPlacement: "outside-left",
	},
};

export const Required: Story = {
	args: {
		label: "Required Field",
		placeholder: "This field is required",
		variant: "bordered",
		color: "primary",
		size: "md",
		labelPlacement: "inside",
		isRequired: true,
	},
};

export const Invalid: Story = {
	args: {
		label: "Invalid Input",
		placeholder: "Enter text",
		variant: "bordered",
		color: "primary",
		size: "md",
		labelPlacement: "inside",
		isInvalid: true,
		errorMessage: "This field is invalid",
	},
};

export const WithDescription: Story = {
	args: {
		label: "Username",
		placeholder: "Enter your username",
		variant: "bordered",
		color: "primary",
		size: "md",
		labelPlacement: "inside",
		description: "Username must be at least 3 characters long",
	},
};

export const Disabled: Story = {
	args: {
		label: "Disabled Input",
		placeholder: "This input is disabled",
		variant: "bordered",
		color: "primary",
		size: "md",
		labelPlacement: "inside",
		isDisabled: true,
		value: "Disabled value",
	},
};

export const ReadOnly: Story = {
	args: {
		label: "Read Only Input",
		placeholder: "This input is read only",
		variant: "bordered",
		color: "primary",
		size: "md",
		labelPlacement: "inside",
		isReadOnly: true,
		value: "Read only value",
	},
};

export const Sizes: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Input
				label="Small Input"
				placeholder="Small size"
				variant="bordered"
				color="primary"
				size="sm"
				labelPlacement="inside"
			/>
			<Input
				label="Medium Input"
				placeholder="Medium size"
				variant="bordered"
				color="primary"
				size="md"
				labelPlacement="inside"
			/>
			<Input
				label="Large Input"
				placeholder="Large size"
				variant="bordered"
				color="primary"
				size="lg"
				labelPlacement="inside"
			/>
		</View>
	),
	args: {},
};

export const Colors: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Input
				label="Default Color"
				placeholder="Default color"
				variant="bordered"
				color="default"
				size="md"
				labelPlacement="inside"
			/>
			<Input
				label="Primary Color"
				placeholder="Primary color"
				variant="bordered"
				color="primary"
				size="md"
				labelPlacement="inside"
			/>
			<Input
				label="Secondary Color"
				placeholder="Secondary color"
				variant="bordered"
				color="secondary"
				size="md"
				labelPlacement="inside"
			/>
			<Input
				label="Success Color"
				placeholder="Success color"
				variant="bordered"
				color="success"
				size="md"
				labelPlacement="inside"
			/>
			<Input
				label="Warning Color"
				placeholder="Warning color"
				variant="bordered"
				color="warning"
				size="md"
				labelPlacement="inside"
			/>
			<Input
				label="Danger Color"
				placeholder="Danger color"
				variant="bordered"
				color="danger"
				size="md"
				labelPlacement="inside"
			/>
		</View>
	),
	args: {},
};

export const Variants: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Input
				label="Flat Variant"
				placeholder="Flat variant"
				variant="flat"
				color="primary"
				size="md"
				labelPlacement="inside"
			/>
			<Input
				label="Bordered Variant"
				placeholder="Bordered variant"
				variant="bordered"
				color="primary"
				size="md"
				labelPlacement="inside"
			/>
			<Input
				label="Underlined Variant"
				placeholder="Underlined variant"
				variant="underlined"
				color="primary"
				size="md"
				labelPlacement="inside"
			/>
			<Input
				label="Faded Variant"
				placeholder="Faded variant"
				variant="faded"
				color="primary"
				size="md"
				labelPlacement="inside"
			/>
		</View>
	),
	args: {},
};

export const FocusTest: Story = {
	render: () => {
		const inputRef = useRef<InputRef>(null);
		const { theme } = useTheme();

		return (
			<View style={{ gap: 16 }}>
				<Input
					ref={inputRef}
					label="Test Input"
					placeholder="Click buttons to test focus"
					variant="bordered"
					color="primary"
					size="md"
					labelPlacement="inside"
				/>
				<View style={{ flexDirection: "row", gap: 10 }}>
					<TouchableOpacity
						style={{
							backgroundColor: theme.colors.primary.DEFAULT,
							padding: 12,
							borderRadius: 8,
							flex: 1,
						}}
						onPress={() => inputRef.current?.focus()}
					>
						<Text style={{ color: "white", textAlign: "center" }}>Focus</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							backgroundColor: theme.colors.danger.DEFAULT,
							padding: 12,
							borderRadius: 8,
							flex: 1,
						}}
						onPress={() => inputRef.current?.blur()}
					>
						<Text style={{ color: "white", textAlign: "center" }}>Blur</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							backgroundColor: theme.colors.warning.DEFAULT,
							padding: 12,
							borderRadius: 8,
							flex: 1,
						}}
						onPress={() => inputRef.current?.clear()}
					>
						<Text style={{ color: "white", textAlign: "center" }}>Clear</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	},
	args: {},
};

import { Ionicons } from "@expo/vector-icons";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
	title: "Forms/Checkbox",
	component: Checkbox,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Checkboxes allow users to select multiple items from a list or to mark individual items as selected. Based on HeroUI design system with React Native animations.",
			},
		},
	},
	argTypes: {
		size: {
			control: { type: "select" },
			options: ["sm", "md", "lg"],
			description: "Size of the checkbox",
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
			description: "Color scheme of the checkbox",
		},
		radius: {
			control: { type: "select" },
			options: ["none", "sm", "md", "lg", "full"],
			description: "Border radius of the checkbox",
		},
		isSelected: {
			control: { type: "boolean" },
			description: "Controlled selection state",
		},
		defaultSelected: {
			control: { type: "boolean" },
			description: "Default selection state (uncontrolled)",
		},
		isDisabled: {
			control: { type: "boolean" },
			description: "Disable the checkbox",
		},
		isIndeterminate: {
			control: { type: "boolean" },
			description: "Show indeterminate state",
		},
		lineThrough: {
			control: { type: "boolean" },
			description: "Cross out label text when selected",
		},
		isRequired: {
			control: { type: "boolean" },
			description: "Show required indicator",
		},
		isInvalid: {
			control: { type: "boolean" },
			description: "Show error state",
		},
		description: {
			control: { type: "text" },
			description: "Helper text description",
		},
		errorMessage: {
			control: { type: "text" },
			description: "Error message text",
		},
	},
	args: {
		children: "체크박스 라벨",
		size: "md",
		color: "primary",
		radius: "sm",
		isSelected: false,
		defaultSelected: false,
		isDisabled: false,
		isIndeterminate: false,
		lineThrough: false,
		isRequired: false,
		isInvalid: false,
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "체크박스 옵션",
	},
};

export const Sizes: Story = {
	render: () => (
		<>
			<Checkbox size="sm">Small</Checkbox>
			<Checkbox size="md">Medium</Checkbox>
			<Checkbox size="lg">Large</Checkbox>
		</>
	),
	parameters: {
		docs: {
			description: {
				story: "체크박스는 sm, md, lg 세 가지 크기를 지원합니다.",
			},
		},
	},
};

export const Colors: Story = {
	render: () => (
		<>
			<Checkbox color="default" defaultSelected>
				Default
			</Checkbox>
			<Checkbox color="primary" defaultSelected>
				Primary
			</Checkbox>
			<Checkbox color="secondary" defaultSelected>
				Secondary
			</Checkbox>
			<Checkbox color="success" defaultSelected>
				Success
			</Checkbox>
			<Checkbox color="warning" defaultSelected>
				Warning
			</Checkbox>
			<Checkbox color="danger" defaultSelected>
				Danger
			</Checkbox>
		</>
	),
	parameters: {
		docs: {
			description: {
				story: "다양한 색상 테마를 지원합니다.",
			},
		},
	},
};

export const Radius: Story = {
	render: () => (
		<>
			<Checkbox radius="none" defaultSelected>
				None
			</Checkbox>
			<Checkbox radius="sm" defaultSelected>
				Small
			</Checkbox>
			<Checkbox radius="md" defaultSelected>
				Medium
			</Checkbox>
			<Checkbox radius="lg" defaultSelected>
				Large
			</Checkbox>
			<Checkbox radius="full" defaultSelected>
				Full
			</Checkbox>
		</>
	),
	parameters: {
		docs: {
			description: {
				story: "다양한 모서리 둥글기를 지원합니다.",
			},
		},
	},
};

export const States: Story = {
	render: () => (
		<>
			<Checkbox>기본 상태</Checkbox>
			<Checkbox defaultSelected>선택됨</Checkbox>
			<Checkbox isIndeterminate>부분 선택</Checkbox>
			<Checkbox isDisabled>비활성화</Checkbox>
			<Checkbox isDisabled defaultSelected>
				비활성화 + 선택됨
			</Checkbox>
		</>
	),
	parameters: {
		docs: {
			description: {
				story: "체크박스의 다양한 상태를 보여줍니다.",
			},
		},
	},
};

export const WithDescription: Story = {
	args: {
		children: "이용약관 동의",
		description: "서비스 이용을 위해 약관에 동의해주세요.",
	},
	parameters: {
		docs: {
			description: {
				story: "체크박스에 설명 텍스트를 추가할 수 있습니다.",
			},
		},
	},
};

export const WithError: Story = {
	args: {
		children: "필수 약관 동의",
		isRequired: true,
		isInvalid: true,
		errorMessage: "필수 약관에 동의해주세요.",
	},
	parameters: {
		docs: {
			description: {
				story: "에러 상태와 필수 표시를 보여줍니다.",
			},
		},
	},
};

export const LineThrough: Story = {
	render: () => (
		<>
			<Checkbox lineThrough>기본 상태</Checkbox>
			<Checkbox lineThrough defaultSelected>
				완료된 할 일
			</Checkbox>
		</>
	),
	parameters: {
		docs: {
			description: {
				story: "선택시 텍스트에 취소선을 표시합니다. 할 일 목록에 유용합니다.",
			},
		},
	},
};

export const CustomIcon: Story = {
	render: (args) => (
		<Checkbox
			{...args}
			defaultSelected
			icon={<Ionicons name="heart" size={12} color="#ffffff" />}
		>
			커스텀 아이콘
		</Checkbox>
	),
	args: {
		color: "danger",
	},
	parameters: {
		docs: {
			description: {
				story: "체크 대신 커스텀 아이콘을 사용할 수 있습니다.",
			},
		},
	},
};

export const Interactive: Story = {
	render: (args) => (
		<Checkbox
			{...args}
			onValueChange={(isSelected) => console.log("선택 상태:", isSelected)}
		>
			클릭해보세요
		</Checkbox>
	),
	parameters: {
		docs: {
			description: {
				story: "체크박스를 클릭하여 상호작용을 테스트할 수 있습니다.",
			},
		},
	},
};

export const ControlledExample: Story = {
	render: () => {
		const [isSelected, setIsSelected] = React.useState(false);

		return (
			<Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
				제어된 체크박스 (현재: {isSelected ? "선택됨" : "선택 안됨"})
			</Checkbox>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "외부 상태로 제어되는 체크박스 예제입니다.",
			},
		},
	},
};

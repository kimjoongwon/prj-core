import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { RadioGroup } from "./RadioGroup";

const meta: Meta<typeof RadioGroup> = {
	title: "Forms/RadioGroup",
	component: RadioGroup,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"RadioGroup allows users to select a single option from a list of mutually exclusive options. Based on HeroUI design system with React Native animations.",
			},
		},
	},
	argTypes: {
		options: {
			control: { type: "object" },
			description: "Array of radio options with key, text, value",
		},
		size: {
			control: { type: "select" },
			options: ["sm", "md", "lg"],
			description: "Size of the radio group",
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
			description: "Color scheme of the radio group",
		},
		orientation: {
			control: { type: "select" },
			options: ["vertical", "horizontal"],
			description: "Layout orientation",
		},
		value: {
			control: { type: "text" },
			description: "Controlled selected value",
		},
		defaultValue: {
			control: { type: "text" },
			description: "Default selected value (uncontrolled)",
		},
		isDisabled: {
			control: { type: "boolean" },
			description: "Disable the entire radio group",
		},
		isRequired: {
			control: { type: "boolean" },
			description: "Show required indicator",
		},
		isInvalid: {
			control: { type: "boolean" },
			description: "Show error state",
		},
		label: {
			control: { type: "text" },
			description: "Group label",
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
		label: "좋아하는 도시를 선택하세요",
		size: "md",
		color: "primary",
		orientation: "vertical",
		isDisabled: false,
		isRequired: false,
		isInvalid: false,
		options: [
			{ key: "seoul", text: "서울", value: "seoul" },
			{ key: "busan", text: "부산", value: "busan" },
			{ key: "incheon", text: "인천", value: "incheon" },
			{ key: "daegu", text: "대구", value: "daegu" },
		],
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => <RadioGroup {...args} />,
};

export const Sizes: Story = {
	render: () => {
		const sizeOptions = [
			{ key: "option1", text: "옵션 1", value: "option1" },
			{ key: "option2", text: "옵션 2", value: "option2" },
		];

		return (
			<>
				<RadioGroup
					label="Small Size"
					size="sm"
					defaultValue="option1"
					options={sizeOptions}
				/>
				<RadioGroup
					label="Medium Size"
					size="md"
					defaultValue="option1"
					options={sizeOptions}
				/>
				<RadioGroup
					label="Large Size"
					size="lg"
					defaultValue="option1"
					options={sizeOptions}
				/>
			</>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "라디오 그룹은 sm, md, lg 세 가지 크기를 지원합니다.",
			},
		},
	},
};

export const Colors: Story = {
	render: () => {
		const colorOptions = [
			{ key: "option1", text: "옵션 1", value: "option1" },
			{ key: "option2", text: "옵션 2", value: "option2" },
		];

		return (
			<>
				<RadioGroup
					label="Default"
					color="default"
					defaultValue="option1"
					options={colorOptions}
				/>
				<RadioGroup
					label="Primary"
					color="primary"
					defaultValue="option1"
					options={colorOptions}
				/>
				<RadioGroup
					label="Secondary"
					color="secondary"
					defaultValue="option1"
					options={colorOptions}
				/>
				<RadioGroup
					label="Success"
					color="success"
					defaultValue="option1"
					options={colorOptions}
				/>
				<RadioGroup
					label="Warning"
					color="warning"
					defaultValue="option1"
					options={colorOptions}
				/>
				<RadioGroup
					label="Danger"
					color="danger"
					defaultValue="option1"
					options={colorOptions}
				/>
			</>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "다양한 색상 테마를 지원합니다.",
			},
		},
	},
};

export const Orientations: Story = {
	render: () => {
		const orientationOptions = [
			{ key: "option1", text: "옵션 1", value: "option1" },
			{ key: "option2", text: "옵션 2", value: "option2" },
			{ key: "option3", text: "옵션 3", value: "option3" },
		];

		return (
			<>
				<RadioGroup
					label="세로 방향 (기본값)"
					orientation="vertical"
					defaultValue="option1"
					options={orientationOptions}
				/>
				<RadioGroup
					label="가로 방향"
					orientation="horizontal"
					defaultValue="option1"
					options={orientationOptions}
				/>
			</>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "세로 또는 가로 방향으로 라디오 버튼을 배치할 수 있습니다.",
			},
		},
	},
};

export const WithDescription: Story = {
	render: () => {
		const shippingOptions = [
			{
				key: "standard",
				text: "일반 배송",
				value: "standard",
				description: "일반 배송 (2-3일 소요)",
			},
			{
				key: "express",
				text: "익일 배송",
				value: "express",
				description: "빠른 배송 (1일 소요)",
			},
			{
				key: "same-day",
				text: "당일 배송",
				value: "same-day",
				description: "당일 배송 (추가 요금)",
			},
		];

		return (
			<RadioGroup
				label="배송 방법 선택"
				description="원하는 배송 방법을 선택해주세요."
				defaultValue="standard"
				options={shippingOptions}
			/>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "그룹과 개별 라디오에 설명 텍스트를 추가할 수 있습니다.",
			},
		},
	},
};

export const States: Story = {
	render: () => {
		const basicOptions = [
			{ key: "option1", text: "선택된 옵션", value: "option1" },
			{ key: "option2", text: "선택되지 않은 옵션", value: "option2" },
		];

		const disabledOptions = [
			{ key: "option1", text: "옵션 1", value: "option1" },
			{ key: "option2", text: "옵션 2", value: "option2" },
		];

		const individualDisabledOptions = [
			{ key: "option1", text: "활성화된 옵션", value: "option1" },
			{
				key: "option2",
				text: "비활성화된 옵션",
				value: "option2",
				isDisabled: true,
			},
		];

		return (
			<>
				<RadioGroup
					label="기본 상태"
					defaultValue="option1"
					options={basicOptions}
				/>
				<RadioGroup
					label="비활성화된 그룹"
					isDisabled
					defaultValue="option1"
					options={disabledOptions}
				/>
				<RadioGroup
					label="개별 비활성화"
					defaultValue="option1"
					options={individualDisabledOptions}
				/>
			</>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "라디오 그룹의 다양한 상태를 보여줍니다.",
			},
		},
	},
};

export const WithError: Story = {
	render: () => {
		const errorOptions = [
			{ key: "option1", text: "옵션 1", value: "option1" },
			{ key: "option2", text: "옵션 2", value: "option2" },
			{ key: "option3", text: "옵션 3", value: "option3" },
		];

		return (
			<RadioGroup
				label="필수 선택 항목"
				isRequired
				isInvalid
				errorMessage="하나의 옵션을 선택해주세요."
				options={errorOptions}
			/>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "에러 상태와 필수 표시를 보여줍니다.",
			},
		},
	},
};

export const Interactive: Story = {
	render: () => {
		const [selectedValue, setSelectedValue] = React.useState("option1");
		const interactiveOptions = [
			{ key: "option1", text: "옵션 1", value: "option1" },
			{ key: "option2", text: "옵션 2", value: "option2" },
			{ key: "option3", text: "옵션 3", value: "option3" },
		];

		return (
			<RadioGroup
				label="상호작용 예제"
				value={selectedValue}
				onValueChange={setSelectedValue}
				description={`현재 선택된 값: ${selectedValue}`}
				options={interactiveOptions}
			/>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "라디오 그룹을 클릭하여 상호작용을 테스트할 수 있습니다.",
			},
		},
	},
};

export const ControlledExample: Story = {
	render: () => {
		const [value, setValue] = React.useState<string | undefined>();
		const frameworkOptions = [
			{ key: "react", text: "React", value: "react" },
			{ key: "vue", text: "Vue", value: "vue" },
			{ key: "angular", text: "Angular", value: "angular" },
			{ key: "svelte", text: "Svelte", value: "svelte" },
		];

		return (
			<RadioGroup
				label="제어된 라디오 그룹"
				value={value}
				onValueChange={setValue}
				description={`선택된 값: ${value || "없음"}`}
				options={frameworkOptions}
			/>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "외부 상태로 제어되는 라디오 그룹 예제입니다.",
			},
		},
	},
};

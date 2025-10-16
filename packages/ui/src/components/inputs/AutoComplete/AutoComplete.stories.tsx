import type { Meta, StoryObj } from "@storybook/react";
import { AutoComplete } from "./AutoComplete";

const meta = {
	title: "inputs/AutoComplete",
	component: AutoComplete,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"검색 가능한 자동완성 입력 컴포넌트입니다. HeroUI Autocomplete를 기반으로 MobX 상태 관리와 통합되어 있습니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		defaultItems: {
			description: "자동완성에 표시할 옵션 배열",
		},
		label: {
			control: "text",
			description: "컴포넌트 라벨 텍스트",
		},
		placeholder: {
			control: "text",
			description: "플레이스홀더 텍스트",
		},
		isDisabled: {
			control: "boolean",
			description: "비활성화 상태",
		},
		isRequired: {
			control: "boolean",
			description: "필수 입력 여부",
		},
		isInvalid: {
			control: "boolean",
			description: "유효성 검사 실패 상태",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "컴포넌트 크기",
		},
		variant: {
			control: "select",
			options: ["flat", "bordered", "faded", "underlined"],
			description: "시각적 변형",
		},
		color: {
			control: "select",
			options: [
				"default",
				"primary",
				"secondary",
				"success",
				"warning",
				"danger",
			],
			description: "색상 테마",
		},
		radius: {
			control: "select",
			options: ["none", "sm", "md", "lg", "full"],
			description: "모서리 둥근 정도",
		},
	},
} satisfies Meta<typeof AutoComplete>;

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 옵션 데이터
const countryOptions = [
	{ key: "kr", label: "대한민국" },
	{ key: "us", label: "미국" },
	{ key: "jp", label: "일본" },
	{ key: "cn", label: "중국" },
	{ key: "uk", label: "영국" },
	{ key: "de", label: "독일" },
	{ key: "fr", label: "프랑스" },
	{ key: "ca", label: "캐나다" },
	{ key: "au", label: "호주" },
	{ key: "sg", label: "싱가포르" },
];

export const 기본: Story = {
	args: {
		defaultItems: countryOptions,
		label: "국가",
	},
};

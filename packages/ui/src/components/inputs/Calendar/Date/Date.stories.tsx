import type { Meta, StoryObj } from "@storybook/react";
import dayjs from "dayjs";
import { Date as DateComponent } from "./Date";

const meta = {
	title: "Inputs/Calendar/Date",
	component: DateComponent,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"캘린더에서 사용되는 날짜 셀 컴포넌트입니다. 선택 상태, 클릭 이벤트 등을 지원합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "text",
			description: "날짜 값 (ISO string)",
		},
		selected: {
			control: "boolean",
			description: "선택된 상태",
			defaultValue: false,
		},
		isPressable: {
			control: "boolean",
			description: "클릭 가능 여부",
			defaultValue: true,
		},
		className: {
			control: "text",
			description: "추가 CSS 클래스",
		},
		onDateClick: {
			action: "clicked",
			description: "날짜 클릭 핸들러",
		},
	},
} satisfies Meta<typeof DateComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
	args: {
		value: dayjs("2024-01-15").toISOString(),
		selected: false,
		isPressable: true,
		className: "text-black",
		onDateClick: (value: string) => console.log("Date clicked:", value),
	},
	render: (args) => <DateComponent {...args} />,
	parameters: {
		docs: {
			description: {
				story: "기본적인 날짜 셀입니다.",
			},
		},
	},
};

export const 선택됨: Story = {
	args: {
		value: dayjs("2024-01-15").toISOString(),
		selected: true,
		isPressable: true,
		className: "text-black",
		onDateClick: (value: string) => console.log("Date clicked:", value),
	},
	render: (args) => <DateComponent {...args} />,
	parameters: {
		docs: {
			description: {
				story: "선택된 상태의 날짜 셀입니다.",
			},
		},
	},
};

export const 비활성화: Story = {
	args: {
		value: dayjs("2024-01-15").toISOString(),
		selected: false,
		isPressable: false,
		className: "text-gray-400",
		onDateClick: (value: string) => console.log("Date clicked:", value),
	},
	render: (args) => <DateComponent {...args} />,
	parameters: {
		docs: {
			description: {
				story: "클릭할 수 없는 비활성화된 날짜 셀입니다.",
			},
		},
	},
};

export const 이전달날짜: Story = {
	args: {
		value: dayjs("2023-12-30").toISOString(),
		selected: false,
		isPressable: false,
		className: "text-gray-400",
		onDateClick: (value: string) => console.log("Date clicked:", value),
	},
	render: (args) => <DateComponent {...args} />,
	parameters: {
		docs: {
			description: {
				story: "이전 달의 날짜를 나타내는 셀입니다.",
			},
		},
	},
};

export const 다음달날짜: Story = {
	args: {
		value: dayjs("2024-02-01").toISOString(),
		selected: false,
		isPressable: false,
		className: "text-gray-400",
		onDateClick: (value: string) => console.log("Date clicked:", value),
	},
	render: (args) => <DateComponent {...args} />,
	parameters: {
		docs: {
			description: {
				story: "다음 달의 날짜를 나타내는 셀입니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {
		value: dayjs("2024-01-15").toISOString(),
		selected: false,
		isPressable: true,
		className: "text-black",
		onDateClick: (value: string) => console.log("Date clicked:", value),
	},
	render: (args) => <DateComponent {...args} />,
	parameters: {
		docs: {
			description: {
				story: "다양한 설정을 테스트할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};

import type { Meta, StoryObj } from "@storybook/react";
import { Header, Month, Year } from "./Header";

const meta = {
	title: "Inputs/Calendar/Header",
	component: Header,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"캘린더의 헤더 컴포넌트입니다. 년도, 월을 표시하고 이전/다음 달로 이동할 수 있는 버튼을 제공합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		year: {
			control: "number",
			description: "표시할 년도",
		},
		month: {
			control: "number",
			description: "표시할 월 (1-12)",
		},
		onPrevMonth: {
			action: "prevMonth",
			description: "이전 달 버튼 클릭 핸들러",
		},
		onNextMonth: {
			action: "nextMonth",
			description: "다음 달 버튼 클릭 핸들러",
		},
	},
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
	args: {
		year: 2024,
		month: 1,
	},
	parameters: {
		docs: {
			description: {
				story: "기본적인 캘린더 헤더입니다.",
			},
		},
	},
};

export const 다른월: Story = {
	args: {
		year: 2024,
		month: 12,
	},
	parameters: {
		docs: {
			description: {
				story: "12월을 표시하는 캘린더 헤더입니다.",
			},
		},
	},
};

export const 다른년도: Story = {
	args: {
		year: 2025,
		month: 6,
	},
	parameters: {
		docs: {
			description: {
				story: "2025년 6월을 표시하는 캘린더 헤더입니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {
		year: 2024,
		month: 1,
	},
	parameters: {
		docs: {
			description: {
				story: "다양한 설정을 테스트할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};

// Year 컴포넌트 스토리
const yearMeta = {
	title: "Inputs/Calendar/Year",
	component: Year,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: "년도를 표시하는 컴포넌트입니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		year: {
			control: "number",
			description: "표시할 년도",
		},
	},
} satisfies Meta<typeof Year>;

export const Year기본: StoryObj<typeof Year> = {
	args: {
		year: 2024,
	},
	parameters: {
		docs: {
			description: {
				story: "기본적인 년도 표시 컴포넌트입니다.",
			},
		},
	},
};

// Month 컴포넌트 스토리
const monthMeta = {
	title: "Inputs/Calendar/Month",
	component: Month,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: "월을 표시하는 컴포넌트입니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		month: {
			control: "number",
			description: "표시할 월 (1-12)",
		},
	},
} satisfies Meta<typeof Month>;

export const Month기본: StoryObj<typeof Month> = {
	args: {
		month: 1,
	},
	parameters: {
		docs: {
			description: {
				story: "기본적인 월 표시 컴포넌트입니다.",
			},
		},
	},
};

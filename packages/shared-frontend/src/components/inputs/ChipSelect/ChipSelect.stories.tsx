import type { Meta, StoryObj } from "@storybook/react";
import { ChipSelect } from "./ChipSelect";

type ChipSelectState = {
	chipSingle?: string | null;
	chipMultiple?: string[];
	chipNone?: string[];
};

const meta = {
	title: "입력 컴포넌트/ChipSelect",
	component: ChipSelect<ChipSelectState>,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "선택 가능한 칩 컴포넌트입니다. 단일 선택, 다중 선택, 선택 불가 모드를 지원합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		options: {
			control: "object",
			description: "칩으로 표시할 옵션 배열",
		},
		selectionMode: {
			control: "select",
			options: ["single", "multiple", "none"],
			description: "선택 모드",
			defaultValue: "multiple",
		},
		state: {
			control: "object",
			description: "MobX 상태 객체",
		},
		path: {
			control: "text",
			description: "상태 경로",
		},
	},
} satisfies Meta<typeof ChipSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 다중선택: Story = {
	args: {
		options: ["JavaScript", "TypeScript", "React", "Vue", "Angular"],
		selectionMode: "multiple",
		state: { chipMultiple: [] },
		path: "chipMultiple",
	},
	parameters: {
		docs: {
			description: {
				story: "여러 개의 칩을 선택할 수 있는 다중 선택 모드입니다.",
			},
		},
	},
};

export const 단일선택: Story = {
	args: {
		options: ["초급", "중급", "고급"],
		selectionMode: "single",
		state: { chipSingle: null },
		path: "chipSingle",
	},
	parameters: {
		docs: {
			description: {
				story: "하나의 칩만 선택할 수 있는 단일 선택 모드입니다.",
			},
		},
	},
};

export const 선택불가: Story = {
	args: {
		options: ["읽기전용", "표시용", "비활성"],
		selectionMode: "none",
		state: { chipNone: [] },
		path: "chipNone",
	},
	parameters: {
		docs: {
			description: {
				story: "선택할 수 없는 읽기 전용 모드입니다.",
			},
		},
	},
};

export const 미리선택됨: Story = {
	args: {
		options: ["HTML", "CSS", "JavaScript", "TypeScript", "React"],
		selectionMode: "multiple",
		state: { chipMultiple: ["JavaScript", "React"] },
		path: "chipMultiple",
	},
	parameters: {
		docs: {
			description: {
				story: "초기값으로 일부 칩이 선택된 상태입니다.",
			},
		},
	},
};

export const 긴목록: Story = {
	args: {
		options: [
			"JavaScript",
			"TypeScript", 
			"React",
			"Vue",
			"Angular",
			"Node.js",
			"Express",
			"Next.js",
			"Nuxt.js",
			"Svelte",
			"SvelteKit",
			"Astro"
		],
		selectionMode: "multiple",
		state: { chipMultiple: [] },
		path: "chipMultiple",
	},
	parameters: {
		docs: {
			description: {
				story: "많은 옵션이 있을 때의 표시 예시입니다.",
			},
		},
	},
	render: (args) => (
		<div className="max-w-md">
			<ChipSelect {...args} />
		</div>
	),
};

export const 다양한모드비교: Story = {
	args: {
		options: ["옵션1", "옵션2", "옵션3"],
		selectionMode: "multiple",
		state: { chipMultiple: [] },
		path: "chipMultiple",
	},
	render: () => (
		<div className="flex flex-col gap-6">
			<div>
				<h3 className="text-lg font-semibold mb-2">다중 선택</h3>
				<ChipSelect
					options={["JavaScript", "TypeScript", "React"]}
					selectionMode="multiple"
					state={{ chipMultiple: ["React"] }}
					path="chipMultiple"
				/>
			</div>
			<div>
				<h3 className="text-lg font-semibold mb-2">단일 선택</h3>
				<ChipSelect
					options={["초급", "중급", "고급"]}
					selectionMode="single"
					state={{ chipSingle: "중급" }}
					path="chipSingle"
				/>
			</div>
			<div>
				<h3 className="text-lg font-semibold mb-2">선택 불가</h3>
				<ChipSelect
					options={["읽기전용", "표시용", "정보용"]}
					selectionMode="none"
					state={{ chipNone: [] }}
					path="chipNone"
				/>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "세 가지 선택 모드를 비교해볼 수 있는 예시입니다.",
			},
		},
	},
};
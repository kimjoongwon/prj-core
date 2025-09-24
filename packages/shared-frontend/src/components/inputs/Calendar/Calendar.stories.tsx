import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Calendar } from "./Calendar";

const meta = {
	title: "Inputs/Calendar",
	component: Calendar,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"날짜를 선택할 수 있는 캘린더 입력 컴포넌트입니다. 여러 날짜를 선택할 수 있으며, ISOString 배열 형태로 값을 관리합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			description: "선택된 날짜들의 ISOString 배열",
			control: { type: "object" },
		},
		onChange: {
			description: "날짜 선택 변경 시 호출되는 콜백 함수",
			action: "changed",
		},
	},
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
	args: {
		value: [],
		onChange: () => {},
	},
	render: (args) => {
		const [value, setValue] = useState<string[]>([]);

		return <Calendar {...args} value={value} onChange={setValue} />;
	},
	parameters: {
		docs: {
			description: {
				story: "기본적인 캘린더 입력 컴포넌트입니다.",
			},
		},
	},
};

export const 미리선택된날짜: Story = {
	args: {
		value: [
			new Date(2024, 0, 15).toISOString(), // 2024년 1월 15일
			new Date(2024, 0, 20).toISOString(), // 2024년 1월 20일
			new Date(2024, 0, 25).toISOString(), // 2024년 1월 25일
		],
		onChange: () => {},
	},
	render: (args) => {
		const [value, setValue] = useState<string[]>(args.value);

		return <Calendar {...args} value={value} onChange={setValue} />;
	},
	parameters: {
		docs: {
			description: {
				story: "미리 선택된 날짜들이 있는 캘린더 입력 컴포넌트입니다.",
			},
		},
	},
};

const CalendarWrapper = () => {
	const [selectedDates, setSelectedDates] = useState<string[]>([]);

	return (
		<div className="space-y-4">
			<Calendar value={selectedDates} onChange={setSelectedDates} />
			<div className="mt-4 rounded bg-gray-100 p-4">
				<h4 className="mb-2 font-semibold">선택된 날짜들:</h4>
				{selectedDates.length === 0 ? (
					<p className="text-gray-500">선택된 날짜가 없습니다.</p>
				) : (
					<ul className="space-y-1">
						{selectedDates.map((dateString) => (
							<li key={dateString} className="text-sm">
								{new Date(dateString).toLocaleDateString("ko-KR")}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export const 플레이그라운드: Story = {
	args: {
		value: [],
		onChange: () => {},
	},
	render: () => <CalendarWrapper />,
	parameters: {
		docs: {
			description: {
				story:
					"선택된 날짜들을 실시간으로 확인할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};

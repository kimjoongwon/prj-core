import type { Meta, StoryObj } from "@storybook/react";
import { List } from "./List";

const meta = {
	title: "ui/List",
	component: List,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"수직 또는 수평으로 아이템을 렌더링할 수 있는 유연한 리스트 컴포넌트입니다. 커스텀 렌더 함수와 플레이스홀더를 지원합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		data: {
			description: "렌더링할 데이터 아이템 배열",
		},
		renderItem: {
			description: "각 아이템을 렌더링할 함수 (item, index) => ReactNode",
		},
		horizontal: {
			control: "boolean",
			description: "수평 레이아웃 여부 (기본값: false)",
		},
		placeholder: {
			description: "리스트가 비어있을 때 보여줄 콘텐츠",
		},
		className: {
			control: "text",
			description: "컨테이너에 적용할 CSS 클래스",
		},
		gap: {
			control: "text",
			description: "아이템 간의 간격 (CSS gap 속성값)",
		},
		itemClassName: {
			control: "text",
			description: "각 아이템 래퍼에 적용할 CSS 클래스",
		},
	},
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

// 스토리용 샘플 데이터
const 샘플아이템들 = [
	{ id: 1, name: "사과", type: "과일", color: "빨간색" },
	{ id: 2, name: "바나나", type: "과일", color: "노란색" },
	{ id: 3, name: "당근", type: "채소", color: "주황색" },
	{ id: 4, name: "브로콜리", type: "채소", color: "초록색" },
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
		gap: "0.5rem",
		placeholder: (
			<div className="text-gray-500 italic">표시할 아이템이 없습니다</div>
		),
	},
	render: (args) => (
		<List
			{...args}
			renderItem={(item, index) => (
				<div className="p-3 border rounded-lg bg-white shadow-sm">
					<span className="text-xs text-gray-400">#{index + 1}</span>
					<div>
						<span className="font-medium">{item.name}</span> - {item.type} (
						{item.color})
					</div>
				</div>
			)}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: "수직으로 배열된 기본 리스트입니다. 인덱스도 함께 표시됩니다.",
			},
		},
	},
};

export const 수평_리스트: Story = {
	args: {
		data: 샘플아이템들,
		horizontal: true,
		gap: "1rem",
		placeholder: (
			<div className="text-gray-500 italic">표시할 아이템이 없습니다</div>
		),
	},
	render: (args) => (
		<div style={{ width: "400px" }}>
			<List
				{...args}
				renderItem={(item, index) => (
					<div className="p-3 border rounded-lg bg-white shadow-sm min-w-[150px]">
						<div className="text-xs text-gray-400 mb-1">#{index + 1}</div>
						<div className="font-medium text-sm">{item.name}</div>
						<div className="text-xs text-gray-600">{item.type}</div>
						<div
							className="w-4 h-4 rounded-full mt-2"
							style={{
								backgroundColor:
									item.color === "빨간색"
										? "red"
										: item.color === "노란색"
											? "yellow"
											: item.color === "주황색"
												? "orange"
												: "green",
							}}
						></div>
					</div>
				)}
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"수평으로 스크롤 가능한 리스트입니다. 아이템이 많을 때 자동으로 스크롤됩니다.",
			},
		},
	},
};

export const 사용자_리스트: Story = {
	args: {
		data: 샘플사용자들,
		horizontal: false,
		gap: "0.75rem",
		placeholder: (
			<div className="text-center text-gray-500 py-8">
				사용자를 찾을 수 없습니다
			</div>
		),
	},
	render: (args) => (
		<List
			{...args}
			renderItem={(user, index) => (
				<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
							{index + 1}
						</div>
						<div>
							<div className="font-medium text-gray-900">{user.name}</div>
							<div className="text-sm text-gray-500">{user.email}</div>
						</div>
					</div>
					<span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
						{user.role}
					</span>
				</div>
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
		placeholder: (
			<div className="text-center py-12">
				<div className="text-gray-400 text-6xl mb-4">📭</div>
				<div className="text-lg font-medium text-gray-600">
					아직 아이템이 없습니다
				</div>
				<div className="text-sm text-gray-500 mt-1">
					시작하려면 아이템을 추가하세요
				</div>
			</div>
		),
	},
	render: (args) => (
		<List
			{...args}
			renderItem={(item: any, index) => (
				<div className="p-2 border rounded">{item.name}</div>
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
		gap: "2rem",
	},
	render: (args) => (
		<div>
			<h3 className="mb-4 font-medium">Gap: {args.gap}</h3>
			<List
				{...args}
				renderItem={(item, index) => (
					<div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
						<div className="font-medium">아이템 {index + 1}</div>
						<div className="text-sm text-gray-600">{item.text}</div>
					</div>
				)}
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "gap 속성을 사용하여 아이템 간의 간격을 조절할 수 있습니다.",
			},
		},
	},
};

export const 간단한_텍스트_리스트: Story = {
	args: {
		data: [
			{ id: 1, text: "첫 번째 아이템" },
			{ id: 2, text: "두 번째 아이템" },
			{ id: 3, text: "세 번째 아이템" },
			{ id: 4, text: "네 번째 아이템" },
		],
		renderItem: (item: any) => <div key={item.id}>{item.text}</div>,
		placeholder: (
			<div className="text-gray-500 p-4">사용 가능한 아이템이 없습니다</div>
		),
	},
	render: (args) => (
		<List
			{...args}
			renderItem={(item: any) => (
				<div
					key={item.id}
					className="px-3 py-2 hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
				>
					{item.text}
				</div>
			)}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: "호버 효과가 있는 간단한 텍스트 리스트입니다.",
			},
		},
	},
};

export const 카드_리스트: Story = {
	args: {
		data: [
			{
				id: 1,
				title: "할 일 1",
				description: "프로젝트 문서 완성",
				status: "대기중",
			},
			{
				id: 2,
				title: "할 일 2",
				description: "코드 변경 사항 검토",
				status: "완료",
			},
			{
				id: 3,
				title: "할 일 3",
				description: "테스트 케이스 업데이트",
				status: "진행중",
			},
		],
		renderItem: (task: any) => <div key={task.id}>{task.title}</div>,
		placeholder: (
			<div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
				<div className="text-gray-400 text-2xl mb-2">📋</div>
				<div className="text-gray-600">사용 가능한 할 일이 없습니다</div>
			</div>
		),
	},
	render: (args) => (
		<List
			{...args}
			renderItem={(task: any) => (
				<div
					key={task.id}
					className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm"
				>
					<div className="flex items-center justify-between mb-2">
						<h3 className="font-medium text-gray-900">{task.title}</h3>
						<span
							className={`px-2 py-1 text-xs rounded-full ${
								task.status === "완료"
									? "bg-green-100 text-green-800"
									: task.status === "진행중"
										? "bg-blue-100 text-blue-800"
										: "bg-gray-100 text-gray-800"
							}`}
						>
							{task.status}
						</span>
					</div>
					<p className="text-sm text-gray-600">{task.description}</p>
				</div>
			)}
		/>
	),
	parameters: {
		docs: {
			description: {
				story:
					"상태 표시기와 상세 플레이스홀더가 있는 카드 스타일 리스트입니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {
		data: 샘플아이템들,
		horizontal: false,
		gap: "0.5rem",
		className: "w-full max-w-md",
		itemClassName: "list-item",
		placeholder: (
			<div className="text-gray-500 text-center py-4">
				보여줄 아이템이 없습니다
			</div>
		),
	},
	render: (args) => (
		<List
			{...args}
			renderItem={(item, index) => (
				<div className="p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium">{item.name}</div>
							<div className="text-sm text-gray-500">
								{item.type} • {item.color}
							</div>
						</div>
						<div className="text-xs text-gray-400">#{index + 1}</div>
					</div>
				</div>
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

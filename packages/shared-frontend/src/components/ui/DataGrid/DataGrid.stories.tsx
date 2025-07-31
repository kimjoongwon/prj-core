import type { Meta, StoryObj } from "@storybook/react";
import { createColumnHelper } from "@tanstack/react-table";
import { observer, useLocalObservable } from "mobx-react-lite";
import { DataGrid, type Key } from "./DataGrid";

interface SampleData {
	id: Key;
	name: string;
	age: number;
	city: string;
	email: string;
	status: "활성" | "비활성";
}

const sampleData: SampleData[] = [
	{
		id: 1,
		name: "김철수",
		age: 30,
		city: "서울",
		email: "chulsoo@example.com",
		status: "활성",
	},
	{
		id: 2,
		name: "이영희",
		age: 28,
		city: "부산",
		email: "younghee@example.com",
		status: "활성",
	},
	{
		id: 3,
		name: "박민수",
		age: 35,
		city: "대구",
		email: "minsoo@example.com",
		status: "비활성",
	},
	{
		id: 4,
		name: "최지영",
		age: 26,
		city: "인천",
		email: "jiyoung@example.com",
		status: "활성",
	},
	{
		id: 5,
		name: "정현우",
		age: 32,
		city: "광주",
		email: "hyunwoo@example.com",
		status: "비활성",
	},
];

const columnHelper = createColumnHelper<SampleData>();

const columns = [
	columnHelper.accessor("id", {
		header: "ID",
	}),
	columnHelper.accessor("name", {
		header: "이름",
	}),
	columnHelper.accessor("age", {
		header: "나이",
	}),
	columnHelper.accessor("city", {
		header: "도시",
	}),
	columnHelper.accessor("email", {
		header: "이메일",
	}),
	columnHelper.accessor("status", {
		header: "상태",
		cell: ({ getValue }) => {
			const status = getValue();
			return (
				<span
					className={status === "활성" ? "text-success-500" : "text-danger-500"}
				>
					{status}
				</span>
			);
		},
	}),
];

const meta = {
	title: "UI/DataGrid",
	component: DataGrid,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"React Table과 HeroUI를 기반으로 한 데이터 그리드 컴포넌트입니다. 선택, 확장, 정렬 등의 기능을 제공합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		data: {
			description: "표시할 데이터 배열",
		},
		columns: {
			description: "테이블 컬럼 정의",
		},
		selectionMode: {
			control: "select",
			options: ["none", "single", "multiple"],
			description: "선택 모드",
			defaultValue: "none",
		},
		state: {
			description: "DataGrid 상태 관리 객체",
		},
	},
} satisfies Meta<typeof DataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const DataGridWrapper = observer<{
	selectionMode?: "none" | "single" | "multiple";
	emptyContent?: string;
}>(({ selectionMode = "none" }) => {
	const state = useLocalObservable(() => ({
		selectedKeys: [] as Key[],
	}));

	return (
		<DataGrid
			data={sampleData}
			columns={columns}
			state={state}
			selectionMode={selectionMode}
		/>
	);
});

export const 기본: Story = {
	args: {
		data: sampleData,
		// @ts-ignore
		columns: columns,
		emptyContent: "데이터가 없습니다.",
		selectionMode: "none",
	},
	render: (args) => <DataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story: "기본적인 데이터 그리드입니다.",
			},
		},
	},
};

export const 단일선택: Story = {
	args: {
		data: sampleData,
		// @ts-ignore
		columns: columns,
		selectionMode: "single",
	},
	render: (args) => <DataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story: "한 번에 하나의 행만 선택할 수 있는 데이터 그리드입니다.",
			},
		},
	},
};

export const 다중선택: Story = {
	args: {
		data: sampleData,
		// @ts-ignore
		columns: columns,
		selectionMode: "multiple",
	},
	render: (args) => <DataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story: "여러 행을 선택할 수 있는 데이터 그리드입니다.",
			},
		},
	},
};

export const 빈데이터: Story = {
	args: {
		data: [],
		// @ts-ignore
		columns: columns,
		emptyContent: "표시할 데이터가 없습니다.",
	},
	render: (args) => <DataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story: "데이터가 없을 때의 데이터 그리드입니다.",
			},
		},
	},
};

export const 커스텀빈내용: Story = {
	args: {
		data: [],
		// @ts-ignore
		columns: columns,
		emptyContent: "🔍 검색 결과가 없습니다.",
	},
	render: (args) => <DataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story: "커스텀 빈 콘텐츠 메시지를 사용한 데이터 그리드입니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {
		data: sampleData,
		// @ts-ignore
		columns: columns,
		selectionMode: "multiple",
		emptyContent: "데이터가 없습니다.",
	},
	render: (args) => <DataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story:
					"다양한 데이터 그리드 설정을 테스트할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};

import type { Meta, StoryObj } from "@storybook/react";
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Table } from "./Table";

interface SampleData {
	id: number;
	name: string;
	age: number;
	city: string;
	email: string;
}

const sampleData: SampleData[] = [
	{
		id: 1,
		name: "김철수",
		age: 30,
		city: "서울",
		email: "chulsoo@example.com",
	},
	{
		id: 2,
		name: "이영희",
		age: 28,
		city: "부산",
		email: "younghee@example.com",
	},
	{ id: 3, name: "박민수", age: 35, city: "대구", email: "minsoo@example.com" },
	{
		id: 4,
		name: "최지영",
		age: 26,
		city: "인천",
		email: "jiyoung@example.com",
	},
	{
		id: 5,
		name: "정현우",
		age: 32,
		city: "광주",
		email: "hyunwoo@example.com",
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
];

const meta: Meta<typeof Table> = {
	title: "UI/Table",
	component: Table,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"React Table 기반의 HeroUI 테이블 컴포넌트입니다. tableInstance prop을 통해 테이블 인스턴스를 전달받습니다.",
			},
		},
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
	args: {
		tableInstance: undefined,
	},
	render: (args) => {
		const tableInstance = useReactTable({
			data: sampleData,
			columns,
			getCoreRowModel: getCoreRowModel(),
		});

		// @ts-ignore
		return <Table {...args} tableInstance={tableInstance} />;
	},
	parameters: {
		docs: {
			description: {
				story: "기본적인 데이터 테이블입니다.",
			},
		},
	},
};

import type { Meta, StoryObj } from "@storybook/react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableComponentProps } from "./Table";

interface SampleData {
  id: string;
  name: string;
  age: number;
  email: string;
  role: string;
}

const sampleData: SampleData[] = [
  {
    id: "1",
    name: "김철수",
    age: 25,
    email: "kim@example.com",
    role: "개발자",
  },
  {
    id: "2",
    name: "이영희",
    age: 30,
    email: "lee@example.com",
    role: "디자이너",
  },
  {
    id: "3",
    name: "박민수",
    age: 28,
    email: "park@example.com",
    role: "기획자",
  },
  {
    id: "4",
    name: "최수정",
    age: 32,
    email: "choi@example.com",
    role: "관리자",
  },
];

const columns: ColumnDef<SampleData>[] = [
  {
    accessorKey: "name",
    header: "이름",
  },
  {
    accessorKey: "age",
    header: "나이",
  },
  {
    accessorKey: "email",
    header: "이메일",
  },
  {
    accessorKey: "role",
    header: "역할",
  },
];

const meta = {
  title: "ui/Table",
  component: Table,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "useReactTable 인스턴스를 받아서 렌더링하는 테이블 컴포넌트입니다.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

type Story = StoryObj<Meta<TableComponentProps<SampleData>>>;

export const 기본: Story = {
  args: {
    table: useReactTable<SampleData>({
      data: sampleData,
      columns,
      getCoreRowModel: getCoreRowModel(),
    }),
  },
  parameters: {
    docs: {
      description: {
        story: "기본 테이블입니다.",
      },
    },
  },
};

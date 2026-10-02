import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "../Chip/Chip";
import { InfoList } from "./InfoList";

const meta = {
	title: "data-display/InfoList",
	component: InfoList,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"상세 화면의 label/value 메타 정보를 정의 목록으로 표시하는 컴포넌트입니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		items: {
			description: "label/value로 표시할 항목 목록",
		},
		columns: {
			control: "select",
			options: [2, 3],
			description: "반응형 최대 column 수 (기본 2)",
			defaultValue: 2,
		},
	},
} satisfies Meta<typeof InfoList>;

export default meta;
type Story = StoryObj<typeof InfoList>;

export const Default: Story = {
	args: {
		items: [
			{ key: "id", label: "Role ID", value: "1024" },
			{ key: "createdAt", label: "생성일", value: "2026-10-02 09:00" },
			{ key: "updatedAt", label: "수정일", value: "2026-10-02 12:30" },
			{ key: "status", label: "상태", value: "사용 중" },
		],
	},
};

export const WithChipValue: Story = {
	args: {
		items: [
			{
				key: "status",
				label: "활성 상태",
				value: <Chip color="success">활성</Chip>,
			},
			{ key: "createdAt", label: "생성일", value: "2026-10-02 09:00" },
		],
	},
};

export const ThreeColumns: Story = {
	args: {
		columns: 3,
		items: [
			{ key: "id", label: "Role ID", value: "1024" },
			{ key: "name", label: "이름", value: "admin" },
			{ key: "createdAt", label: "생성일", value: "2026-10-02 09:00" },
			{ key: "updatedAt", label: "수정일", value: "2026-10-02 12:30" },
		],
	},
};

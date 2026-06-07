import type { Meta, StoryObj } from "@storybook/react";
import { ListBox } from "./ListBox";

const meta = {
	title: "collection/ListBox",
	component: ListBox,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"HeroUI ListBox 문서와 같은 collection compound wrapper입니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		children: {
			table: {
				disable: true,
			},
			control: false,
		},
		selectionMode: {
			control: "select",
			options: ["none", "single", "multiple"],
		},
		variant: {
			control: "select",
			options: ["default", "danger"],
		},
	},
} satisfies Meta<typeof ListBox>;

export default meta;
type Story = StoryObj<typeof meta>;

const fruitItems = (
	<>
		<ListBox.Item id="apple" textValue="사과">
			<ListBox.ItemIndicator />
			<div>
				<div className="text-sm font-medium">사과</div>
				<div className="text-xs text-default-500">아침 메뉴에 어울립니다.</div>
			</div>
		</ListBox.Item>
		<ListBox.Item id="banana" textValue="바나나">
			<ListBox.ItemIndicator />
			<div>
				<div className="text-sm font-medium">바나나</div>
				<div className="text-xs text-default-500">운동 전 간식으로 좋습니다.</div>
			</div>
		</ListBox.Item>
		<ListBox.Item id="grape" textValue="포도" isDisabled>
			<ListBox.ItemIndicator />
			<div>
				<div className="text-sm font-medium">포도</div>
				<div className="text-xs text-default-500">오늘은 선택할 수 없습니다.</div>
			</div>
		</ListBox.Item>
	</>
);

const renderListBox = (args: Story["args"]) => (
	<ListBox {...args}>{fruitItems}</ListBox>
);

export const Default: Story = {
	args: {
		"aria-label": "과일",
		defaultSelectedKeys: ["apple"],
		selectionMode: "single",
	},
	render: renderListBox,
};

export const Multiple: Story = {
	args: {
		"aria-label": "과일",
		defaultSelectedKeys: ["apple", "banana"],
		selectionMode: "multiple",
	},
	render: renderListBox,
};

export const Section: Story = {
	args: {
		"aria-label": "프로젝트",
		defaultSelectedKeys: ["today"],
		selectionMode: "single",
	},
	render: (args) => (
		<ListBox {...args}>
			<ListBox.Section>
				<ListBox.Item id="today" textValue="오늘">
					<ListBox.ItemIndicator />
					오늘
				</ListBox.Item>
				<ListBox.Item id="scheduled" textValue="예약됨">
					<ListBox.ItemIndicator />
					예약됨
				</ListBox.Item>
			</ListBox.Section>
			<ListBox.Section>
				<ListBox.Item id="archive" textValue="보관함">
					<ListBox.ItemIndicator />
					보관함
				</ListBox.Item>
			</ListBox.Section>
		</ListBox>
	),
};

export const Danger: Story = {
	args: {
		"aria-label": "과일",
		defaultSelectedKeys: ["banana"],
		selectionMode: "single",
		variant: "danger",
	},
	render: renderListBox,
};

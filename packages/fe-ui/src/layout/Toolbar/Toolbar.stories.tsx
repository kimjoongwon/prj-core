import type { Meta, StoryObj } from "@storybook/react";
import { Bold, Italic, Redo2, Save, Underline, Undo2 } from "lucide-react";
import { Button, ButtonGroup } from "../../action";
import { ToggleButton } from "../../selection/ToggleButton/ToggleButton";
import { ToggleButtonGroup } from "../../selection/ToggleButtonGroup/ToggleButtonGroup";
import { Separator } from "../Separator";
import { Toolbar } from "./Toolbar";

const meta = {
	title: "layout/Toolbar",
	component: Toolbar,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"HeroUI Toolbar 문서와 같은 compound composition 래퍼입니다.",
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
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
		},
		isAttached: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const iconSize = 16;

const toolbarItems = (
	<>
		<ToggleButtonGroup
			aria-label="텍스트 서식"
			defaultSelectedKeys={["bold"]}
			size="sm"
		>
			<ToggleButton id="bold" aria-label="굵게">
				<Bold size={iconSize} />
			</ToggleButton>
			<ToggleButton id="italic" aria-label="기울임">
				<Italic size={iconSize} />
			</ToggleButton>
			<ToggleButton id="underline" aria-label="밑줄">
				<Underline size={iconSize} />
			</ToggleButton>
		</ToggleButtonGroup>
		<Separator />
		<ButtonGroup aria-label="문서 작업" size="sm" variant="ghost">
			<Button isIconOnly aria-label="실행 취소">
				<Undo2 size={iconSize} />
			</Button>
			<Button isIconOnly aria-label="다시 실행">
				<Redo2 size={iconSize} />
			</Button>
			<Button isIconOnly aria-label="저장">
				<Save size={iconSize} />
			</Button>
		</ButtonGroup>
	</>
);

const renderToolbar = (args: Story["args"]) => (
	<Toolbar {...args}>{toolbarItems}</Toolbar>
);

export const Horizontal: Story = {
	args: {
		"aria-label": "편집 도구",
		orientation: "horizontal",
	},
	render: renderToolbar,
};

export const Vertical: Story = {
	args: {
		"aria-label": "편집 도구",
		orientation: "vertical",
	},
	render: renderToolbar,
};

export const Attached: Story = {
	args: {
		"aria-label": "편집 도구",
		isAttached: true,
		orientation: "horizontal",
	},
	render: renderToolbar,
};

export const Composition: Story = {
	args: {
		"aria-label": "편집 도구",
		orientation: "horizontal",
	},
	render: (args) => <Toolbar.Root {...args}>{toolbarItems}</Toolbar.Root>,
};

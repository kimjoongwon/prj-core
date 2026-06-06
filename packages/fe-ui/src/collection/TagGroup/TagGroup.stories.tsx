import type { Meta, StoryObj } from "@storybook/react";
import { TagGroup } from "./TagGroup";

const meta: Meta<typeof TagGroup> = {
	title: "Collections/TagGroup",
	component: TagGroup,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleOptions = [
	{ text: "React", value: "react" },
	{ text: "TypeScript", value: "typescript" },
	{ text: "HeroUI", value: "heroui" },
	{ text: "Storybook", value: "storybook" },
];

export const Default: Story = {
	args: {
		options: sampleOptions,
		selectionMode: "single",
		defaultValue: "react",
	},
};

export const States: Story = {
	render: () => (
		<div className="flex w-full flex-col gap-4">
			<div>
				<TagGroup
					options={sampleOptions}
					selectionMode="single"
					defaultValue="react"
				/>
			</div>
			<div>
				<TagGroup
					options={[
						{ text: "React", value: "react" },
						{ text: "TypeScript", value: "typescript", isDisabled: true },
						{ text: "HeroUI", value: "heroui" },
					]}
					selectionMode="single"
					defaultValue="heroui"
				/>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "단일 선택 및 비활성 항목 상태를 간결하게 확인합니다.",
			},
		},
	},
};

export const Single: Story = Default;

export const Multi: Story = {
	args: {
		options: sampleOptions,
		selectionMode: "multiple",
		defaultValue: ["react", "typescript"],
	},
};

export const Disabled: Story = {
	args: {
		options: [
			{ text: "React", value: "react" },
			{ text: "TypeScript", value: "typescript", isDisabled: true },
			{ text: "HeroUI", value: "heroui" },
		],
		selectionMode: "single",
		defaultValue: "heroui",
	},
};

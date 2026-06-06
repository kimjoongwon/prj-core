import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Tooltip } from "./Tooltip";

const meta = {
	title: "Overlay/Tooltip",
	component: Tooltip,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

const DefaultTooltip = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Tooltip isOpen={isOpen} onOpenChange={setIsOpen}>
			<Tooltip.Trigger>
				<button
					className="rounded bg-primary px-4 py-2 text-white"
					type="button"
				>
					툴팁
				</button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<div className="rounded-md bg-content1 border border-divider p-2">
					툴팁 콘텐츠
				</div>
			</Tooltip.Content>
		</Tooltip>
	);
};

const TooltipStates = () => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Tooltip isOpen={isOpen} onOpenChange={setIsOpen}>
			<Tooltip.Trigger>
				<button
					className="rounded bg-primary px-4 py-2 text-white"
					type="button"
				>
					항상 열림 상태
				</button>
			</Tooltip.Trigger>
			<Tooltip.Content placement="top" showArrow>
				<div className="rounded-md bg-content1 border border-divider p-2">
					항상 열린 툴팁 상태입니다.
				</div>
			</Tooltip.Content>
		</Tooltip>
	);
};

const TooltipVariants = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Tooltip isOpen={isOpen} onOpenChange={setIsOpen}>
			<Tooltip.Trigger>
				<button
					className="rounded bg-secondary px-4 py-2 text-white"
					type="button"
				>
					툴팁 위치
				</button>
			</Tooltip.Trigger>
			<Tooltip.Content placement="left" showArrow offset={12}>
				<div className="rounded-md bg-content1 border border-divider p-2">
					배치/offset variant 샘플입니다.
				</div>
			</Tooltip.Content>
		</Tooltip>
	);
};

const TooltipComposition = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Tooltip.Root isOpen={isOpen} onOpenChange={setIsOpen}>
			<Tooltip.Trigger>
				<button
					className="rounded bg-accent px-4 py-2 text-white"
					type="button"
				>
					복합 API
				</button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<div className="rounded-md bg-content1 border border-divider p-2">
					Root/Trigger/Content 조합 예시입니다.
				</div>
			</Tooltip.Content>
		</Tooltip.Root>
	);
};

export const Default: Story = {
	args: {
		children: null,
	},
	render: () => <DefaultTooltip />,
};

export const States: Story = {
	args: {
		children: null,
	},
	render: () => <TooltipStates />,
};

export const Variants: Story = {
	args: {
		children: null,
	},
	render: () => <TooltipVariants />,
};

export const Composition: Story = {
	args: {
		children: null,
	},
	render: () => <TooltipComposition />,
};

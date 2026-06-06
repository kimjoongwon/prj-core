import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Popover } from "./Popover";

const meta = {
	title: "Overlay/Popover",
	component: Popover,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

const DefaultPopover = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popover isOpen={isOpen} onOpenChange={setIsOpen}>
			<Popover.Trigger>
				<button
					className="rounded bg-primary px-4 py-2 text-white"
					type="button"
				>
					툴팁 포털 열기
				</button>
			</Popover.Trigger>
			<Popover.Content placement="bottom">
				<div className="rounded-md bg-content1 border border-divider p-3">
					<p>기본 Popover 콘텐츠</p>
				</div>
			</Popover.Content>
		</Popover>
	);
};

const PopoverStates = () => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Popover isOpen={isOpen} onOpenChange={setIsOpen}>
			<Popover.Trigger>
				<button
					className="rounded bg-primary px-4 py-2 text-white"
					type="button"
				>
					항상 열림 상태
				</button>
			</Popover.Trigger>
			<Popover.Content placement="top">
				<div className="rounded-md bg-content1 border border-divider p-3">
					<p>항상 열려 있는 상태</p>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						className="mt-2 rounded border border-divider px-3 py-1"
					>
						닫기
					</button>
				</div>
			</Popover.Content>
		</Popover>
	);
};

const PopoverVariants = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popover isOpen={isOpen} onOpenChange={setIsOpen}>
			<Popover.Trigger>
				<button
					className="rounded bg-secondary px-4 py-2 text-white"
					type="button"
				>
					위치 변경
				</button>
			</Popover.Trigger>
			<Popover.Content placement="right">
				<div className="rounded-md bg-content1 border border-divider p-3">
					<p>placement: right variant 예시</p>
				</div>
			</Popover.Content>
		</Popover>
	);
};

const PopoverComposition = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popover.Root isOpen={isOpen} onOpenChange={setIsOpen}>
			<Popover.Trigger>
				<button
					className="rounded bg-accent px-4 py-2 text-white"
					type="button"
				>
					복합 API
				</button>
			</Popover.Trigger>
			<Popover.Content placement="left">
				<div className="rounded-md bg-content1 border border-divider p-3">
					<p>Composition story</p>
				</div>
			</Popover.Content>
		</Popover.Root>
	);
};

export const Default: Story = {
	args: {
		children: null,
	},
	render: () => <DefaultPopover />,
};

export const States: Story = {
	args: {
		children: null,
	},
	render: () => <PopoverStates />,
};

export const Variants: Story = {
	args: {
		children: null,
	},
	render: () => <PopoverVariants />,
};

export const Composition: Story = {
	args: {
		children: null,
	},
	render: () => <PopoverComposition />,
};

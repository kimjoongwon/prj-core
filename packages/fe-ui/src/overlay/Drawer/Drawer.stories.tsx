import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Drawer } from "./Drawer";

const meta = {
	title: "Overlay/Drawer",
	component: Drawer,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

const DefaultDrawer = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
			<Drawer.Trigger>
				<button
					className="rounded bg-primary px-4 py-2 text-white"
					type="button"
				>
					드로어 열기
				</button>
			</Drawer.Trigger>
			<Drawer.Backdrop>
				<Drawer.Content placement="right">
					<Drawer.Header>
						<Drawer.Heading>드로어</Drawer.Heading>
					</Drawer.Header>
					<Drawer.Body>
						<p>기본 드로어 내용 영역입니다.</p>
					</Drawer.Body>
					<Drawer.Footer>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="rounded border border-divider px-4 py-2"
						>
							닫기
						</button>
					</Drawer.Footer>
				</Drawer.Content>
			</Drawer.Backdrop>
		</Drawer>
	);
};

const DrawerStates = () => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
			<Drawer.Backdrop>
				<Drawer.Content placement="left">
					<Drawer.Header>
						<Drawer.Heading>항상 열림 상태</Drawer.Heading>
					</Drawer.Header>
					<Drawer.Body>
						<p>현재 isOpen을 true로 고정해 둔 상태입니다.</p>
					</Drawer.Body>
					<Drawer.Footer>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="rounded bg-danger px-4 py-2 text-white"
						>
							닫기
						</button>
					</Drawer.Footer>
				</Drawer.Content>
			</Drawer.Backdrop>
		</Drawer>
	);
};

const DrawerVariants = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
			<Drawer.Trigger>
				<button
					className="rounded bg-secondary px-4 py-2 text-white"
					type="button"
				>
					상단 드로어
				</button>
			</Drawer.Trigger>
			<Drawer.Backdrop>
				<Drawer.Content placement="top">
					<Drawer.Header>
						<Drawer.Heading>Placement: top</Drawer.Heading>
					</Drawer.Header>
					<Drawer.Body>
						<p>배치 variant 예시입니다.</p>
					</Drawer.Body>
					<Drawer.Footer>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="rounded border border-divider px-4 py-2"
						>
							닫기
						</button>
					</Drawer.Footer>
				</Drawer.Content>
			</Drawer.Backdrop>
		</Drawer>
	);
};

const DrawerComposition = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Drawer.Root isOpen={isOpen} onOpenChange={setIsOpen}>
			<Drawer.Trigger>
				<button
					className="rounded bg-accent px-4 py-2 text-white"
					type="button"
				>
					복합 API
				</button>
			</Drawer.Trigger>
			<Drawer.Backdrop>
				<Drawer.Content placement="bottom">
					<Drawer.Header>
						<Drawer.Heading>복합 API 샘플</Drawer.Heading>
					</Drawer.Header>
					<Drawer.Body>
						<p>Root/Trigger/Content/Body/Footer를 조합한 드로어입니다.</p>
					</Drawer.Body>
					<Drawer.Footer>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="rounded border border-divider px-4 py-2"
						>
							닫기
						</button>
					</Drawer.Footer>
				</Drawer.Content>
			</Drawer.Backdrop>
		</Drawer.Root>
	);
};

export const Default: Story = {
	args: {
		children: null,
	},
	render: () => <DefaultDrawer />,
};

export const States: Story = {
	args: {
		children: null,
	},
	render: () => <DrawerStates />,
};

export const Variants: Story = {
	args: {
		children: null,
	},
	render: () => <DrawerVariants />,
};

export const Composition: Story = {
	args: {
		children: null,
	},
	render: () => <DrawerComposition />,
};

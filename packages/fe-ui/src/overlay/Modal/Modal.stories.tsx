import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Modal } from "./Modal";

const meta = {
	title: "Overlay/Modal",
	component: Modal,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

const DefaultModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
			<Modal.Trigger>
				<button
					className="rounded bg-primary px-4 py-2 text-white"
					type="button"
				>
					모달 열기
				</button>
			</Modal.Trigger>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog>
						<Modal.Header>
							<Modal.Heading>기본 모달</Modal.Heading>
						</Modal.Header>
						<Modal.Body>
							<p>HeroUI Modal과 동일한 Compound API를 그대로 노출합니다.</p>
						</Modal.Body>
						<Modal.Footer>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded border border-divider px-4 py-2"
							>
								닫기
							</button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
};

const ModalStates = () => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
			<Modal.Backdrop>
				<Modal.Container size="lg">
					<Modal.Dialog>
						<Modal.Header>
							<Modal.Heading>열린 상태</Modal.Heading>
						</Modal.Header>
						<Modal.Body>
							<p>현재 isOpen 상태가 true로 고정된 모달입니다.</p>
						</Modal.Body>
						<Modal.Footer>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded bg-danger px-4 py-2 text-white"
							>
								닫기
							</button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
};

const ModalVariants = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
			<Modal.Trigger>
				<button
					className="rounded bg-secondary px-4 py-2 text-white"
					type="button"
				>
					큰 모달 열기
				</button>
			</Modal.Trigger>
			<Modal.Backdrop>
				<Modal.Container size="full" placement="center" scroll="inside">
					<Modal.Dialog>
						<Modal.Header>
							<Modal.Heading>Variants 샘플</Modal.Heading>
						</Modal.Header>
						<Modal.Body>
							<p>size/placement/scroll 조합을 보여주는 예시입니다.</p>
						</Modal.Body>
						<Modal.Footer>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded border border-divider px-4 py-2"
							>
								닫기
							</button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
};

const ModalComposition = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Modal.Root isOpen={isOpen} onOpenChange={setIsOpen}>
			<Modal.Trigger>
				<button
					className="rounded bg-accent px-4 py-2 text-white"
					type="button"
				>
					복합 API
				</button>
			</Modal.Trigger>
			<Modal.Backdrop>
				<Modal.Container placement="top" size="md">
					<Modal.Dialog>
						<Modal.Header>
							<Modal.Heading>복합 API 샘플</Modal.Heading>
						</Modal.Header>
						<Modal.Body>
							<p>Root/Trigger/Backdrop/Container/Dialog 조합 예시입니다.</p>
						</Modal.Body>
						<Modal.Footer>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded border border-divider px-4 py-2"
							>
								닫기
							</button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal.Root>
	);
};

export const Default: Story = {
	args: {
		children: null,
	},
	render: () => <DefaultModal />,
};

export const States: Story = {
	args: {
		children: null,
	},
	render: () => <ModalStates />,
};

export const Variants: Story = {
	args: {
		children: null,
	},
	render: () => <ModalVariants />,
};

export const Composition: Story = {
	args: {
		children: null,
	},
	render: () => <ModalComposition />,
};

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AlertDialog } from "./AlertDialog";

const meta = {
	title: "Overlay/AlertDialog",
	component: AlertDialog,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof AlertDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

const DefaultAlertDialog = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<AlertDialog isOpen={isOpen} onOpenChange={setIsOpen}>
			<AlertDialog.Trigger>
				<button
					className="rounded bg-primary px-4 py-2 text-white"
					type="button"
				>
					경고 열기
				</button>
			</AlertDialog.Trigger>
			<AlertDialog.Backdrop>
				<AlertDialog.Container size="sm">
					<AlertDialog.Dialog>
						<AlertDialog.Header>
							<AlertDialog.Heading>정말 삭제하시겠습니까?</AlertDialog.Heading>
						</AlertDialog.Header>
						<AlertDialog.Body>
							<p>이 작업은 되돌릴 수 없습니다.</p>
						</AlertDialog.Body>
						<AlertDialog.Footer>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded border border-divider px-4 py-2"
							>
								닫기
							</button>
						</AlertDialog.Footer>
					</AlertDialog.Dialog>
				</AlertDialog.Container>
			</AlertDialog.Backdrop>
		</AlertDialog>
	);
};

const AlertDialogStates = () => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<AlertDialog isOpen={isOpen} onOpenChange={setIsOpen}>
			<AlertDialog.Backdrop isDismissable={false}>
				<AlertDialog.Container placement="center" size="sm">
					<AlertDialog.Dialog>
						<AlertDialog.Header>
							<AlertDialog.Heading>확인 상태</AlertDialog.Heading>
						</AlertDialog.Header>
						<AlertDialog.Body>
							<p>현재 상태를 고정해 둔 AlertDialog입니다.</p>
						</AlertDialog.Body>
						<AlertDialog.Footer>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded bg-danger px-4 py-2 text-white"
							>
								닫기
							</button>
						</AlertDialog.Footer>
					</AlertDialog.Dialog>
				</AlertDialog.Container>
			</AlertDialog.Backdrop>
		</AlertDialog>
	);
};

const AlertDialogVariants = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<AlertDialog isOpen={isOpen} onOpenChange={setIsOpen}>
			<AlertDialog.Trigger>
				<button
					className="rounded bg-danger px-4 py-2 text-white"
					type="button"
				>
					큰 사이즈 열기
				</button>
			</AlertDialog.Trigger>
			<AlertDialog.Backdrop>
				<AlertDialog.Container size="lg">
					<AlertDialog.Dialog>
						<AlertDialog.Body>
							<p>size: lg variant를 적용한 AlertDialog입니다.</p>
						</AlertDialog.Body>
						<AlertDialog.Footer>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded border border-divider px-4 py-2"
							>
								닫기
							</button>
						</AlertDialog.Footer>
					</AlertDialog.Dialog>
				</AlertDialog.Container>
			</AlertDialog.Backdrop>
		</AlertDialog>
	);
};

const AlertDialogComposition = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<AlertDialog.Root isOpen={isOpen} onOpenChange={setIsOpen}>
			<AlertDialog.Trigger>
				<button
					className="rounded bg-secondary px-4 py-2 text-white"
					type="button"
				>
					복합 API 샘플
				</button>
			</AlertDialog.Trigger>
			<AlertDialog.Backdrop>
				<AlertDialog.Container placement="top" size="md">
					<AlertDialog.Dialog>
						<AlertDialog.Header>
							<AlertDialog.Heading>복합 예시</AlertDialog.Heading>
						</AlertDialog.Header>
						<AlertDialog.Body>
							<p>
								Root/Trigger/Header/Body/Footer를 명시적으로 조합한 예시입니다.
							</p>
						</AlertDialog.Body>
						<AlertDialog.Footer>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded border border-divider px-4 py-2"
							>
								닫기
							</button>
						</AlertDialog.Footer>
					</AlertDialog.Dialog>
				</AlertDialog.Container>
			</AlertDialog.Backdrop>
		</AlertDialog.Root>
	);
};

export const Default: Story = {
	args: {
		children: null,
	},
	render: () => <DefaultAlertDialog />,
};

export const States: Story = {
	args: {
		children: null,
	},
	render: () => <AlertDialogStates />,
};

export const Variants: Story = {
	args: {
		children: null,
	},
	render: () => <AlertDialogVariants />,
};

export const Composition: Story = {
	args: {
		children: null,
	},
	render: () => <AlertDialogComposition />,
};

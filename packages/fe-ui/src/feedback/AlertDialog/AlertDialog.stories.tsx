import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../input/Button/Button";
import { AlertDialog } from "./AlertDialog";

const meta = {
	title: "feedback/AlertDialog",
	component: AlertDialog,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		children: (
			<>
				<AlertDialog.Trigger>
					<Button color="danger" variant="flat">
						삭제
					</Button>
				</AlertDialog.Trigger>
				<AlertDialog.Backdrop>
					<AlertDialog.Container size="sm">
						<AlertDialog.Dialog>
							<AlertDialog.Header>
								<AlertDialog.Icon status="danger" />
								<AlertDialog.Heading>항목 삭제</AlertDialog.Heading>
							</AlertDialog.Header>
							<AlertDialog.Body>
								선택한 항목을 삭제합니다. 이 작업은 되돌릴 수 없습니다.
							</AlertDialog.Body>
							<AlertDialog.Footer>
								<Button variant="flat" slot="close">
									취소
								</Button>
								<Button color="danger" slot="close">
									삭제
								</Button>
							</AlertDialog.Footer>
						</AlertDialog.Dialog>
					</AlertDialog.Container>
				</AlertDialog.Backdrop>
			</>
		),
	},
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Danger: Story = {};

export const Warning: Story = {
	args: {
		children: (
			<>
				<AlertDialog.Trigger>
					<Button color="warning" variant="flat">
						변경 취소
					</Button>
				</AlertDialog.Trigger>
				<AlertDialog.Backdrop>
					<AlertDialog.Container size="sm">
						<AlertDialog.Dialog>
							<AlertDialog.Header>
								<AlertDialog.Icon status="warning" />
								<AlertDialog.Heading>변경 사항 버리기</AlertDialog.Heading>
							</AlertDialog.Header>
							<AlertDialog.Body>
								저장하지 않은 변경 사항이 사라집니다.
							</AlertDialog.Body>
							<AlertDialog.Footer>
								<Button variant="flat" slot="close">
									계속 편집
								</Button>
								<Button color="warning" slot="close">
									버리기
								</Button>
							</AlertDialog.Footer>
						</AlertDialog.Dialog>
					</AlertDialog.Container>
				</AlertDialog.Backdrop>
			</>
		),
	},
};

import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { Toast } from "./Toast";

const meta = {
	title: "Ui/feedback/Toast",
	component: Toast.Provider,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "HeroUI Toast queue API를 노출하는 feedback wrapper입니다.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Toast.Provider>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToastPreview = ({
	description,
	title,
	variant,
}: {
	description?: string;
	title: string;
	variant?: "default" | "accent" | "success" | "warning" | "danger";
}) => {
	useEffect(() => {
		Toast.toast.clear();
		Toast.toast(title, {
			description,
			variant,
			timeout: 10000,
		});

		return () => {
			Toast.toast.clear();
		};
	}, [description, title, variant]);

	return <Toast.Provider placement="top" />;
};

export const Default: Story = {
	render: () => (
		<ToastPreview
			title="기본 토스트 메시지입니다."
			description="Toast.Provider와 queue helper를 함께 사용합니다."
			variant="default"
		/>
	),
};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-col gap-2">
			<button
				type="button"
				className="rounded-md border border-divider px-3 py-2"
				onClick={() => Toast.toast.success("저장 완료")}
			>
				Success
			</button>
			<button
				type="button"
				className="rounded-md border border-divider px-3 py-2"
				onClick={() => Toast.toast.warning("확인이 필요합니다")}
			>
				Warning
			</button>
			<button
				type="button"
				className="rounded-md border border-divider px-3 py-2"
				onClick={() => Toast.toast.danger("오류가 발생했습니다")}
			>
				Danger
			</button>
			<Toast.Provider placement="top end" />
		</div>
	),
};

export const Composition: Story = {
	render: () => (
		<Toast.Provider
			placement="bottom end"
			children={({ toast }) => (
				<Toast toast={toast}>
					<Toast.Content>
						<Toast.Title>{toast.content.title}</Toast.Title>
						<Toast.Description>{toast.content.description}</Toast.Description>
					</Toast.Content>
					<Toast.CloseButton />
				</Toast>
			)}
		/>
	),
};

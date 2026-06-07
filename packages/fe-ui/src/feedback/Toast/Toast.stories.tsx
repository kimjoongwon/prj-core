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

	return (
		<div className="min-w-64 rounded-md border border-divider bg-content1 px-4 py-3 text-foreground">
			<p className="font-medium text-sm">{title}</p>
			{description ? (
				<p className="text-default-500 text-xs">{description}</p>
			) : null}
			<Toast.Provider placement="top" />
		</div>
	);
};

const ToastCompositionPreview = () => {
	useEffect(() => {
		Toast.toast.clear();
		Toast.toast("커스텀 토스트 렌더러", {
			description: "Toast.Provider children render prop을 사용합니다.",
			timeout: 10000,
			variant: "accent",
		});

		return () => {
			Toast.toast.clear();
		};
	}, []);

	return (
		<div className="min-w-64 rounded-md border border-divider bg-content1 px-4 py-3 text-foreground">
			<p className="font-medium text-sm">커스텀 토스트 렌더러</p>
			<p className="text-default-500 text-xs">children render prop composition</p>
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
		</div>
	);
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
	render: () => <ToastCompositionPreview />,
};

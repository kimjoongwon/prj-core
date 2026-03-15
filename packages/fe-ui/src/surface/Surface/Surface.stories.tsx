import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@heroui/react";
import { Surface } from "./Surface";

const meta: Meta<typeof Surface> = {
	title: "Surface/Surface",
	component: Surface,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: (
			<div className="flex flex-col gap-3">
				<h3 className="font-semibold text-lg">기본 Surface</h3>
				<p className="text-default-600 text-sm">
					콘텐츠가 올라가는 기본 표면입니다.
				</p>
			</div>
		),
	},
};

export const Raised: Story = {
	args: {
		elevation: "raised",
		children: (
			<div className="flex items-center justify-between gap-4">
				<div>
					<h3 className="font-semibold text-lg">Raised</h3>
					<p className="text-default-600 text-sm">
						페이지 단위 배경에 사용하는 표면입니다.
					</p>
				</div>
				<Button size="sm" variant="flat">
					액션
				</Button>
			</div>
		),
	},
};

export const NoPadding: Story = {
	args: {
		padding: "none",
		children: (
			<div className="overflow-hidden rounded-xl">
				<div className="border-b border-divider px-6 py-4 font-medium">
					패딩 없음
				</div>
				<div className="px-6 py-4 text-default-600 text-sm">
					DataGrid처럼 내부 컴포넌트가 자체 패딩을 가지는 경우에 사용합니다.
				</div>
			</div>
		),
	},
};

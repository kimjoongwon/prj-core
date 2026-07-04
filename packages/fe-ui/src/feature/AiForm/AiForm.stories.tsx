import type { Meta, StoryObj } from "@storybook/react";
import { AiForm } from "./AiForm";

const fieldMeta = {
	name: {
		label: "프로그램명",
		ai: { fillable: true, reason: "기본 설명에서 추출", defaultChecked: true },
	},
	description: {
		label: "설명",
		ai: { fillable: true, reason: "요약 문장 생성", defaultChecked: true },
	},
	category: {
		label: "카테고리",
		ai: { fillable: true, reason: "옵션 중 추천", defaultChecked: false },
	},
} as never;

const meta = {
	title: "feature/AiForm",
	component: AiForm,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		formState: { name: "", description: "", category: "" },
		fieldMeta,
		aiSchemas: [
			{
				key: "program",
				label: "프로그램 기본 정보",
				paths: ["name", "description", "category"],
			},
		] as never,
		ui: { hiddenPaths: [], readOnlyPaths: [], disabledPaths: [] } as never,
		options: {
			category: [
				{ label: "요가", value: "yoga" },
				{ label: "필라테스", value: "pilates" },
			],
		} as never,
		onFill: async () =>
			({
				patches: [
					{ path: "name", value: "모닝 요가" },
					{ path: "description", value: "초보자를 위한 아침 수업" },
				],
			}) as never,
		applyPatch: () => undefined,
		onRevalidate: () => undefined,
	},
} satisfies Meta<typeof AiForm>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="w-[520px]">
			<AiForm {...args} />
		</div>
	),
};
export const Disabled: Story = {
	args: { disabled: true },
	render: Default.render,
};

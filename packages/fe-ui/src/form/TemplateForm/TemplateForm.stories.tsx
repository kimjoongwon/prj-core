import type { Meta, StoryObj } from "@storybook/react";
import { TemplateForm } from "./TemplateForm";

const formData = {
	type: "EMAIL",
	code: "WELCOME_EMAIL",
	name: "가입 환영",
	description: "신규 가입자에게 발송",
	subject: "{{userName}}님 환영합니다",
	content: "<p>{{userName}}님 가입을 환영합니다.</p>",
} as const;
const variables = [
	{
		id: "var-1",
		name: "userName",
		description: "고객 이름",
		defaultValue: "김온유",
		isRequired: true,
	},
];
const meta = {
	title: "form/TemplateForm",
	component: TemplateForm,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		state: {
			formData,
			variables,
			errors: {},
		},
	},
} satisfies Meta<typeof TemplateForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Create: Story = {
	render: (args) => (
		<div className="w-[820px]">
			<TemplateForm {...args} />
		</div>
	),
};
export const WithErrors: Story = {
	args: {
		state: {
			formData,
			variables,
			errors: { name: "이름을 입력하세요.", content: "본문을 입력하세요." },
			variableErrors: { 0: { name: "변수명을 확인하세요." } },
		},
	},
	render: Create.render,
};

export const ReadOnly: Story = {
	args: {
		state: {
			formData,
			variables,
			errors: {},
		},
		readOnly: true,
	},
	render: Create.render,
};

import type { Meta, StoryObj } from "@storybook/react";
import { TemplateCreateScreen } from "./TemplateCreateScreen";

const defaultArgs = {
	errors: {},
	formData: {
		code: "code-1",
		content: "스토리북에서 확인할 content 예시입니다.",
		description: "스토리북에서 확인할 description 예시입니다.",
		subject: "subject-1",
		type: "EMAIL",
	},
	isSubmitting: false,
	onClickCancelButton: (..._args: never[]) => undefined,
	onFormDataChange: (..._args: never[]) => undefined,
	onSubmitForm: (..._args: never[]) => undefined,
	onVariablesChange: (..._args: never[]) => undefined,
	variables: [
		{
			defaultValue: "default-value-1",
			description: "스토리북에서 확인할 description 예시입니다.",
			id: "template-variable-1",
			isRequired: false,
			name: "userName",
		},
		{
			defaultValue: "default-value-1",
			description: "스토리북에서 확인할 description 예시입니다.",
			id: "template-variable-2",
			isRequired: false,
			name: "orderNumber",
		},
	],
};

const busyArgs = {
	...defaultArgs,
	isSubmitting: true,
};

const emptyStateArgs = {
	...defaultArgs,
	variables: [],
};

const meta = {
	component: TemplateCreateScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof TemplateCreateScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
	args: busyArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};

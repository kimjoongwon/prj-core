import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import type { ComponentProps } from "react";
import { useStorybookState } from "../../storybook";
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
type TemplateFormStoryState = ComponentProps<typeof TemplateForm>["state"];
export const createTemplateFormStoryState = (initial: TemplateFormStoryState) =>
	makeAutoObservable(
		{ ...initial, formData: { ...initial.formData }, variables: initial.variables.map((variable) => ({ ...variable })), errors: { ...initial.errors }, variableErrors: { ...initial.variableErrors } },
		{},
		{ autoBind: true, name: "TemplateFormStoryState" },
	);
const renderTemplateForm = (args: ComponentProps<typeof TemplateForm>) => {
	const state = useLocalObservable(() => createTemplateFormStoryState(args.state));
	useStorybookState(() => ({ formData: state.formData, variables: state.variables, errors: state.errors }), "TemplateForm");
	return <div className="w-[820px]"><TemplateForm {...args} state={state} /></div>;
};
const meta = {
	title: "form/TemplateForm",
	component: TemplateForm,
	excludeStories: ["createTemplateFormStoryState"],
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		state: {
			formData,
			variables,
			errors: {},
		},
	},
	render: renderTemplateForm,
} satisfies Meta<typeof TemplateForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Create: Story = {
	render: renderTemplateForm,
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
	render: renderTemplateForm,
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
	render: renderTemplateForm,
};

import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../input/Button/Button";
import { TemplateEditScreen } from "./TemplateEditScreen";

const defaultState = {
	formData: {
		type: "EMAIL" as const,
		code: "WELCOME_EMAIL",
		name: "가입 환영",
		description: "신규 가입자에게 발송합니다.",
		subject: "{{userName}}님 환영합니다",
		content: "<p>{{userName}}님 가입을 환영합니다.</p>",
	},
	variables: [
		{
			id: "var-1",
			name: "userName",
			description: "사용자 이름",
			defaultValue: "김온유",
			isRequired: true,
		},
	],
	errors: {},
};

const meta = {
	title: "screen/TemplateEditScreen",
	component: TemplateEditScreen,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		title: "Template 수정",
		description: "route가 전달한 Template state로 메시지 템플릿을 편집합니다.",
		state: defaultState,
		actions: <Button color="primary">저장</Button>,
	},
} satisfies Meta<typeof TemplateEditScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Edit: Story = {};

export const Create: Story = {
	args: {
		title: "Template 등록",
		description: "새로운 Template을 등록합니다.",
		state: {
			...defaultState,
			formData: {
				...defaultState.formData,
				code: "",
				name: "",
				description: "",
				subject: "",
				content: "",
			},
			variables: [],
		},
	},
};

export const Detail: Story = {
	args: {
		title: "Template 상세",
		description: "Template 정보를 읽기 전용으로 확인합니다.",
		readOnly: true,
		actions: <Button variant="flat">수정</Button>,
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
};

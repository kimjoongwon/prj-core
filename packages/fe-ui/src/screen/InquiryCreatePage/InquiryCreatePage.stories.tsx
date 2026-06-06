import type { Meta, StoryObj } from "@storybook/react";
import { InquiryCreatePage } from "./InquiryCreatePage";

const defaultArgs = {
	bootstrap: {
		aiSchemas: [],
		fieldMeta: {},
		options: {},
		ui: { readOnlyPaths: [], hiddenPaths: [], disabledPaths: [] },
	},
	categoryOptions: [
		{
			text: "일반 문의",
			value: "GENERAL",
		},
		{
			text: "결제 문의",
			value: "BILLING",
		},
	],
	channelOptions: [
		{
			text: "웹",
			value: "WEB",
		},
		{
			text: "이메일",
			value: "EMAIL",
		},
	],
	formState: {
		category: "GENERAL",
		channel: "WEB",
		content: "스토리북에서 확인할 content 예시입니다.",
		customerId: "customer-1",
		customerKeyword: "customer-keyword-1",
		errors: {},
		priority: "LOW",
		searchResults: [
			{
				description: "스토리북용 고객 검색 결과",
				email: "member@example.com",
				id: "customer-1",
				label: "홍길동 · member@example.com",
				name: "홍길동",
				phone: "010-1234-5678",
			},
		],
		title: "샘플 title",
	},
	isLoading: false,
	isSubmitting: false,
	onApplyAiPatch: (..._args: never[]) => undefined,
	onChangeCategorySelection: (..._args: never[]) => undefined,
	onChangeChannelSelection: (..._args: never[]) => undefined,
	onChangeContentTextArea: (..._args: never[]) => undefined,
	onChangeCustomerKeyword: (..._args: never[]) => undefined,
	onChangePrioritySelection: (..._args: never[]) => undefined,
	onChangeTitleInput: (..._args: never[]) => undefined,
	onClickBackButton: (..._args: never[]) => undefined,
	onClickCancelButton: (..._args: never[]) => undefined,
	onClickSubmitButton: (..._args: never[]) => undefined,
	onFillAiForm: async (..._args: never[]) => undefined,
	onRevalidateAiForm: (..._args: never[]) => undefined,
	onSearchCustomer: (..._args: never[]) => undefined,
	onSelectCustomer: (..._args: never[]) => undefined,
	priorityOptions: [
		{
			text: "낮음",
			value: "LOW",
		},
		{
			text: "높음",
			value: "HIGH",
		},
	],
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const busyArgs = {
	...defaultArgs,
	isSubmitting: true,
};

const emptyStateArgs = {
	...defaultArgs,
	formState: {
		...defaultArgs.formState,
		customerId: "",
		searchResults: [],
	},
	categoryOptions: [],
	channelOptions: [],
	priorityOptions: [],
};

const meta = {
	component: InquiryCreatePage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof InquiryCreatePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const Busy: Story = {
	args: busyArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};

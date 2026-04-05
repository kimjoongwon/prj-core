import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
import { PageStoryCard } from "../storybookFrame";
import { PhoneVerifyPage, type PhoneVerifyPageState } from "./PhoneVerifyPage";

const meta = {
	component: PhoneVerifyPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: {
		onSendVerificationCode: () => undefined,
		onVerifyCode: () => undefined,
		isCodeSent: false,
		isLoading: false,
	},
} satisfies Meta<typeof PhoneVerifyPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderPhoneVerifyPage =
	(initialState: PhoneVerifyPageState): Story["render"] =>
	(args) => {
		const state = useLocalObservable(() => ({ ...initialState }));

		return (
			<PageStoryCard>
				<PhoneVerifyPage {...args} state={state} />
			</PageStoryCard>
		);
	};

export const Default: Story = {
	render: renderPhoneVerifyPage({
		phone: "",
		verificationCode: "",
		errorMessage: "",
	}),
};

export const CodeSent: Story = {
	args: {
		isCodeSent: true,
	},
	render: renderPhoneVerifyPage({
		phone: "010-1234-5678",
		verificationCode: "",
		errorMessage: "",
	}),
};

export const VerificationFailed: Story = {
	args: {
		isCodeSent: true,
	},
	render: renderPhoneVerifyPage({
		phone: "010-1234-5678",
		verificationCode: "102233",
		errorMessage: "인증번호가 만료되었습니다. 다시 요청해주세요.",
	}),
};

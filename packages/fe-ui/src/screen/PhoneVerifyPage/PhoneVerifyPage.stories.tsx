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
		state: {
			phone: "",
			verificationCode: "",
			errorMessage: "",
		},
		onSendVerificationCode: () => undefined,
		onVerifyCode: () => undefined,
		isCodeSent: false,
		isLoading: false,
	},
} satisfies Meta<typeof PhoneVerifyPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderPhoneVerifyPage: Story["render"] = (args) => {
	const state = useLocalObservable<PhoneVerifyPageState>(() => ({
		...args.state,
	}));

	return (
		<PageStoryCard>
			<PhoneVerifyPage {...args} state={state} />
		</PageStoryCard>
	);
};

export const Default: Story = {
	render: renderPhoneVerifyPage,
};

export const CodeSent: Story = {
	args: {
		state: {
			phone: "010-1234-5678",
			verificationCode: "",
			errorMessage: "",
		},
		isCodeSent: true,
	},
	render: renderPhoneVerifyPage,
};

export const VerificationFailed: Story = {
	args: {
		state: {
			phone: "010-1234-5678",
			verificationCode: "102233",
			errorMessage: "인증번호가 만료되었습니다. 다시 요청해주세요.",
		},
		isCodeSent: true,
	},
	render: renderPhoneVerifyPage,
};

import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
import { PageStoryCard } from "../storybookFrame";
import {
	AddressEmailVerifyScreen,
	type AddressEmailVerifyScreenState,
} from "./AddressEmailVerifyScreen";

const meta = {
	component: AddressEmailVerifyScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: {
		state: {
			address: "",
			email: "",
			emailVerificationCode: "",
			errorMessage: "",
		},
		onSendEmailVerification: () => undefined,
		onSubmit: () => undefined,
		isEmailCodeSent: false,
		isLoading: false,
	},
} satisfies Meta<typeof AddressEmailVerifyScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderAddressEmailVerifyScreen: Story["render"] = (args) => {
	const state = useLocalObservable<AddressEmailVerifyScreenState>(() => ({
		...args.state,
	}));

	return (
		<PageStoryCard>
			<AddressEmailVerifyScreen {...args} state={state} />
		</PageStoryCard>
	);
};

export const Default: Story = {
	render: renderAddressEmailVerifyScreen,
};

export const EmailCodeSent: Story = {
	args: {
		state: {
			address: "서울특별시 강남구 테헤란로 152",
			email: "member@example.com",
			emailVerificationCode: "",
			errorMessage: "",
		},
		isEmailCodeSent: true,
	},
	render: renderAddressEmailVerifyScreen,
};

export const VerificationFailed: Story = {
	args: {
		state: {
			address: "서울특별시 강남구 테헤란로 152",
			email: "member@example.com",
			emailVerificationCode: "004122",
			errorMessage: "이메일 인증번호가 일치하지 않습니다.",
		},
		isEmailCodeSent: true,
	},
	render: renderAddressEmailVerifyScreen,
};

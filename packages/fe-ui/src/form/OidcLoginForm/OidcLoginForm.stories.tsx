import type { Meta, StoryObj } from "@storybook/react";
import { observable } from "mobx";
import { OidcLoginForm } from "./OidcLoginForm";

const client = {
	clientId: "reservation-admin",
	name: "예약 관리자",
	loginUi: {
		variant: "branded",
		brandLabel: "Onora Admin",
		headline: "관리자 로그인",
		description: "운영 콘솔에 접속하세요.",
	},
} as const;
const meta = {
	title: "form/OidcLoginForm",
	component: OidcLoginForm,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof OidcLoginForm>;
export default meta;
type Story = StoryObj<typeof meta>;
const render: Story["render"] = (args) => (
	<div className="w-[420px]">
		<OidcLoginForm {...args} state={observable({ ...args.state })} />
	</div>
);
export const Default: Story = {
	args: {
		state: {
			email: "",
			password: "",
			remember: false,
			error: null,
			isSubmitting: false,
		},
		client,
	},
	render,
};
export const Error: Story = {
	args: {
		state: {
			email: "ops@example.com",
			password: "",
			remember: true,
			error: { error: "INVALID_CREDENTIALS", remainingAttempts: 3 },
			isSubmitting: false,
		},
		client,
	},
	render,
};

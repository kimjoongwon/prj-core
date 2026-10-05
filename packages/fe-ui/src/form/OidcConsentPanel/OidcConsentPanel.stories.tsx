import type { Meta, StoryObj } from "@storybook/react";
import { observable } from "mobx";
import { OidcConsentPanel } from "./OidcConsentPanel";

const client = {
	clientId: "reservation-admin",
	name: "예약 관리자",
	loginUi: { brandLabel: "Plate Admin", variant: "branded" },
} as const;
const meta = {
	title: "form/OidcConsentPanel",
	component: OidcConsentPanel,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof OidcConsentPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
const render: Story["render"] = (args) => (
	<div className="w-[420px]">
		<OidcConsentPanel {...args} state={observable({ ...args.state })} />
	</div>
);
export const Default: Story = {
	args: {
		state: { errorMessage: null, isSubmitting: false },
		client,
		missingScopes: ["openid", "profile", "email"],
	},
	render,
};
export const Error: Story = {
	args: {
		state: { errorMessage: "동의 처리에 실패했습니다.", isSubmitting: false },
		client,
		missingScopes: ["openid"],
	},
	render,
};

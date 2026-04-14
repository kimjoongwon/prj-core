import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
import { PageStoryCard } from "../storybookFrame";
import {
	PasswordInputPage,
	type PasswordInputPageState,
} from "./PasswordInputPage";

const meta = {
	component: PasswordInputPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: {
		state: {
			password: "",
			passwordConfirm: "",
			errorMessage: "",
		},
		onSubmit: () => undefined,
		isLoading: false,
	},
} satisfies Meta<typeof PasswordInputPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderPasswordInputPage: Story["render"] = (args) => {
	const state = useLocalObservable<PasswordInputPageState>(() => ({
		...args.state,
	}));

	return (
		<PageStoryCard>
			<PasswordInputPage {...args} state={state} />
		</PageStoryCard>
	);
};

export const Default: Story = {
	render: renderPasswordInputPage,
};

export const ValidationError: Story = {
	args: {
		state: {
			password: "password123!",
			passwordConfirm: "password12",
			errorMessage: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
		},
	},
	render: renderPasswordInputPage,
};

export const Loading: Story = {
	args: {
		state: {
			password: "securePass123!",
			passwordConfirm: "securePass123!",
			errorMessage: "",
		},
		isLoading: true,
	},
	render: renderPasswordInputPage,
};

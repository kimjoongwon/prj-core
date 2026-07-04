import type { Meta, StoryObj } from "@storybook/react";
import { GroundEditScreen } from "./GroundEditScreen";

const defaultArgs = {
	description: "샘플 시설 1 시설 detail을 수정합니다.",
	isLoading: false,
	isNotFound: false,
	isSubmitPending: false,
	readOnly: false,
	onClickCancelButton: (..._args: never[]) => undefined,
	onClickSaveButton: (..._args: never[]) => undefined,
	state: {
		address: "address-1",
		businessNo: "123-45-67891",
		contentLanguageCode: "ko_KR",
		email: "member1@example.com",
		errors: {},
		label: "샘플 label 1",
		name: "샘플 시설 1",
		phone: "010-1234-5670",
	},
	title: "시설 정보 수정",
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const notFoundArgs = {
	...defaultArgs,
	isNotFound: true,
};

const busyArgs = {
	...defaultArgs,
	isSubmitPending: true,
};

const readOnlyArgs = {
	...defaultArgs,
	description: "시설 기본 정보를 확인합니다.",
	readOnly: true,
	title: "샘플 시설 1",
};

const meta = {
	title: "screen/GroundEditScreen",
	component: GroundEditScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof GroundEditScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const NotFound: Story = {
	args: notFoundArgs as never,
};

export const Busy: Story = {
	args: busyArgs as never,
};

export const ReadOnly: Story = {
	args: readOnlyArgs as never,
};

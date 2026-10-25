import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { ComponentProps } from "react";
import { useStorybookState } from "../../storybook";
import { SpaceCreateScreen } from "./SpaceCreateScreen";

const defaultArgs = {
	address: "address-1",
	businessNo: "123-45-67891",
	contentLanguageCode: "ko_KR",
	email: "member1@example.com",
	errors: {},
	isSubmitPending: false,
	label: "샘플 label 1",
	name: "샘플 스페이스",
	onChangeAddressInput: (..._args: never[]) => undefined,
	onChangeBusinessNoInput: (..._args: never[]) => undefined,
	onChangeEmailInput: (..._args: never[]) => undefined,
	onChangeLabelInput: (..._args: never[]) => undefined,
	onChangeNameInput: (..._args: never[]) => undefined,
	onChangePhoneInput: (..._args: never[]) => undefined,
	onChangeContentLanguageSelect: (..._args: never[]) => undefined,
	onClickCancelButton: (..._args: never[]) => undefined,
	onClickSaveButton: (..._args: never[]) => undefined,
	phone: "010-1234-5670",
};

const busyArgs = {
	...defaultArgs,
	isSubmitPending: true,
};
const createSpaceCreateScreenStoryState = (initial: typeof defaultArgs) => {
	let state: typeof defaultArgs & Record<string, unknown>;
	state = makeAutoObservable({
		...initial,
		onChangeAddressInput: (value: string) => { state.address = value; },
		onChangeBusinessNoInput: (value: string) => { state.businessNo = value; },
		onChangeEmailInput: (value: string) => { state.email = value; },
		onChangeLabelInput: (value: string) => { state.label = value; },
		onChangeNameInput: (value: string) => { state.name = value; },
		onChangePhoneInput: (value: string) => { state.phone = value; },
		onChangeContentLanguageSelect: (value: string) => { state.contentLanguageCode = value; },
		onClickCancelButton: () => { state.lastAction = "cancel"; },
		onClickSaveButton: () => { state.lastAction = "save"; },
		lastAction: "",
	}, {}, { autoBind: true, name: "SpaceCreateScreenStoryState" });
	return state;
};

const meta = {
	title: "screen/SpaceCreateScreen",
	component: SpaceCreateScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	excludeStories: ["SpaceCreateScreenStoryHarness", "createSpaceCreateScreenStoryState"],
	args: defaultArgs as never,
	render: (args) => <SpaceCreateScreenStoryHarness args={args as never} />,
} satisfies Meta<typeof SpaceCreateScreen>;

export const SpaceCreateScreenStoryHarness = observer(function SpaceCreateScreenStoryHarness({
	args,
}: { args: ComponentProps<typeof SpaceCreateScreen> }) {
	const state = useLocalObservable(() => createSpaceCreateScreenStoryState(args as never));
		useStorybookState(() => ({ name: state.name, label: state.label, email: state.email, lastAction: state.lastAction }), "SpaceCreateScreen");
	return <SpaceCreateScreen {...(state as unknown as ComponentProps<typeof SpaceCreateScreen>)} />;
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
	args: busyArgs as never,
};

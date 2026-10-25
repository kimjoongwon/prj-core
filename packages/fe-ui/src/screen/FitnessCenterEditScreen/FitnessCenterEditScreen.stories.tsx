import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import type { ComponentProps } from "react";
import { useStorybookState } from "../../storybook";
import { FitnessCenterFormState } from "../../form/FitnessCenterForm/FitnessCenterForm.state";
import { FitnessCenterEditScreen } from "./FitnessCenterEditScreen";

const defaultArgs = {
	description: "샘플 피트니스 센터 1 정보와 Space 콘텐츠 언어를 수정합니다.",
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
		name: "샘플 피트니스 센터 1",
		phone: "010-1234-5670",
	},
	title: "피트니스 센터 정보 수정",
};
type FitnessCenterEditStoryState = ComponentProps<typeof FitnessCenterEditScreen>["state"];
const createFitnessCenterEditScreenStoryState = (initial: FitnessCenterEditStoryState) => {
	const state = Object.assign(new FitnessCenterFormState(), initial, {
		lastAction: "",
	});
	return makeAutoObservable(state, {}, { autoBind: true, name: "FitnessCenterEditScreenStoryState" });
};
const renderFitnessCenterEditScreen = (args: ComponentProps<typeof FitnessCenterEditScreen>) => {
	const state = useLocalObservable(() => createFitnessCenterEditScreenStoryState(args.state));
	useStorybookState(() => ({ name: state.name, label: state.label, email: state.email, contentLanguageCode: state.contentLanguageCode, lastAction: state.lastAction }), "FitnessCenterEditScreen");
	return (
		<FitnessCenterEditScreen
			{...args}
			state={state}
			onClickCancelButton={() => { state.lastAction = "cancel"; }}
			onClickSaveButton={() => { state.lastAction = "save"; }}
		/>
	);
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
	description: "피트니스 센터 기본 정보를 확인합니다.",
	readOnly: true,
	title: "샘플 피트니스 센터 1",
};

const meta = {
	title: "screen/FitnessCenterEditScreen",
	component: FitnessCenterEditScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
	render: renderFitnessCenterEditScreen,
} satisfies Meta<typeof FitnessCenterEditScreen>;

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

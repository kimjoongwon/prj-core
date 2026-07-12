import { ModalState } from "@cocrepo/store";
import type { Meta, StoryObj } from "@storybook/react";
import { ProgramPicker } from "./ProgramPicker";
import { ProgramPickerState } from "./ProgramPickerState";

function createModalState(options = defaultOptions) {
	const programPickerState = new ProgramPickerState({
		searchLabel: "검색",
		searchPlaceholder: "프로그램명",
		options,
		selectedId: options[0]?.id,
		onSelect: () => undefined,
	});

	return new ModalState(
		{
			title: "프로그램 선택",
			state: programPickerState,
			content: { kind: "component", component: ProgramPicker },
		},
		(state) => state.deactivate(),
	);
}

const defaultOptions = [
	{ id: "program-yoga", name: "모닝 요가", subtitle: "초급 / 60분" },
	{
		id: "program-pilates",
		name: "리포머 필라테스",
		subtitle: "중급 / 50분",
	},
];

const meta = {
	title: "domain/program/ProgramPicker",
	component: ProgramPicker,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		state: createModalState(),
	},
} satisfies Meta<typeof ProgramPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
	args: { state: createModalState([]) },
};

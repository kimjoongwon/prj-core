import { ModalState } from "@cocrepo/store";
import type { PlanningScenario } from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react";
import { PlanningPreviewFrame } from "../../planning/PlanningPreviewFrame";
import { ProgramPicker } from "./ProgramPicker";
import { programPickerHandlers } from "./ProgramPicker.msw";
import { ProgramPickerState } from "./ProgramPickerState";

function createModalState(kind: "routine" | "instructor" = "routine") {
	const programPickerState = new ProgramPickerState({
		kind,
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

const defaultScenario = {
	id: "program-picker.default",
	title: "Program 후보 선택",
	description: "Picker가 API에서 후보를 조회합니다.",
	routePath: "/timelines/programs",
	owner: "fe-ui / domain/program",
	status: "ready-for-review",
	context: {
		realm: "admin",
		authState: "authenticated",
		role: "SPACE_MANAGER",
		tenantId: "101",
		spaceId: "201",
		locale: "ko-KR",
		viewport: "desktop",
	},
} satisfies PlanningScenario;

export const Default: Story = {
	parameters: { planning: defaultScenario, msw: { handlers: programPickerHandlers } },
	render: (args) => (
		<PlanningPreviewFrame scenario={defaultScenario}>
			<ProgramPicker {...args} />
		</PlanningPreviewFrame>
	),
};

export const Instructor: Story = {
	args: { state: createModalState("instructor") },
	parameters: { planning: defaultScenario, msw: { handlers: programPickerHandlers } },
	render: (args) => (
		<PlanningPreviewFrame scenario={defaultScenario}>
			<ProgramPicker {...args} />
		</PlanningPreviewFrame>
	),
};

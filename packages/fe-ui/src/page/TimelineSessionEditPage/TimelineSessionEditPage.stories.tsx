import type { Meta, StoryObj } from "@storybook/react";
import { TimelineSessionEditPage } from "./TimelineSessionEditPage";

const defaultArgs = {
  "description": "스토리북에서 확인할 description 예시입니다.",
  "descriptionText": "스토리북에서 확인할 description text 예시입니다.",
  "endDateTime": "2026-04-14T09:00:00.000Z",
  "errors": {},
  "isSubmitDisabled": false,
  "isSubmitPending": false,
  "onChangeCycleTypeSelect": (..._args: never[]) => undefined,
  "onChangeDayOfWeekSelect": (..._args: never[]) => undefined,
  "onChangeDescriptionTextarea": (..._args: never[]) => undefined,
  "onChangeEndDateTimeInput": (..._args: never[]) => undefined,
  "onChangeNameInput": (..._args: never[]) => undefined,
  "onChangeStartDateTimeInput": (..._args: never[]) => undefined,
  "onChangeTypeSelect": (..._args: never[]) => undefined,
  "onClickCancelButton": (..._args: never[]) => undefined,
  "onClickSubmitButton": (..._args: never[]) => undefined,
  "recurringDayOfWeek": "MONDAY",
  "repeatCycleType": "WEEKLY",
  "startDateTime": "2026-04-14T09:00:00.000Z",
  "type": "ONE_TIME",
};

const busyArgs = {
  ...defaultArgs,
  "isSubmitPending": true,
};

const meta = {
  component: TimelineSessionEditPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof TimelineSessionEditPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
  args: busyArgs as never,
};

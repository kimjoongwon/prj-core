import type { Meta, StoryObj } from "@storybook/react";
import { AdminTimelinesTimelineIdPage } from "./AdminTimelinesTimelineIdPage";

const defaultArgs = {
  "connectedSessions": 1,
  "deleteSessionTargetName": "샘플 delete session target name 1",
  "isDeleteSessionModalOpen": false,
  "isDeleteSessionPending": false,
  "isDeleteTimelineModalOpen": false,
  "isDeleteTimelinePending": false,
  "onClickCreateProgramButton": (..._args: never[]) => undefined,
  "onClickCreateSessionButton": (..._args: never[]) => undefined,
  "onClickDeleteSessionButton": (..._args: never[]) => undefined,
  "onClickDeleteSessionCancelButton": (..._args: never[]) => undefined,
  "onClickDeleteSessionConfirmButton": (..._args: never[]) => undefined,
  "onClickDeleteTimelineButton": (..._args: never[]) => undefined,
  "onClickDeleteTimelineCancelButton": (..._args: never[]) => undefined,
  "onClickDeleteTimelineConfirmButton": (..._args: never[]) => undefined,
  "onClickEditButton": (..._args: never[]) => undefined,
  "onClickSessionNameButton": (..._args: never[]) => undefined,
  "sessions": [{
  "createdAt": "2026-04-14T09:00:00.000Z",
  "id": "item-1",
  "isConnected": false,
  "programCount": 12,
  "recurringDayLabel": "샘플 recurring day label 1",
  "repeatCycleLabel": "샘플 repeat cycle label 1",
  "startDateTime": "2026-04-14T09:00:00.000Z",
  "typeColor": "primary",
  "typeLabel": "샘플 type label 1",
}, {
  "createdAt": "2026-04-14T09:00:00.000Z",
  "id": "item-1",
  "isConnected": false,
  "programCount": 12,
  "recurringDayLabel": "샘플 recurring day label 1",
  "repeatCycleLabel": "샘플 repeat cycle label 1",
  "startDateTime": "2026-04-14T09:00:00.000Z",
  "typeColor": "primary",
  "typeLabel": "샘플 type label 1",
}],
  "timeline": {
  "createdAt": "2026-04-14T09:00:00.000Z",
  "description": "스토리북에서 확인할 description 예시입니다.",
},
  "title": "샘플 title",
  "totalSessions": 12,
  "unconnectedSessions": 1,
};

const emptyStateArgs = {
  ...defaultArgs,
  "sessions": [],
};

const meta = {
  component: AdminTimelinesTimelineIdPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof AdminTimelinesTimelineIdPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyState: Story = {
  args: emptyStateArgs as never,
};

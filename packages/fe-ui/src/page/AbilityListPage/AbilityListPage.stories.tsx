import type { Meta, StoryObj } from "@storybook/react";
import { AbilityListPage } from "./AbilityListPage";

const defaultArgs = {
  "abilities": [{
  "actionId": "action-1",
  "actionLabel": "샘플 action label 1",
  "createdAt": "2026-04-14T09:00:00.000Z",
  "fieldCount": 12,
  "hasConditions": false,
  "id": "item-1",
  "inverted": false,
  "subjectId": "subject-1",
  "subjectLabel": "샘플 subject label 1",
}, {
  "actionId": "action-1",
  "actionLabel": "샘플 action label 1",
  "createdAt": "2026-04-14T09:00:00.000Z",
  "fieldCount": 12,
  "hasConditions": false,
  "id": "item-1",
  "inverted": false,
  "subjectId": "subject-1",
  "subjectLabel": "샘플 subject label 1",
}],
  "actions": [{
  "id": "item-1",
  "label": "샘플 label 1",
}, {
  "id": "item-1",
  "label": "샘플 label 1",
}],
  "filters": {
  "searchTerm": "샘플",
  "selectedActionId": "selected-action-1",
  "selectedInverted": "selected-inverted-1",
  "selectedSubjectId": "selected-subject-1",
},
  "isLoading": false,
  "onChangeActionId": (..._args: never[]) => undefined,
  "onChangeInverted": (..._args: never[]) => undefined,
  "onChangeSearchTerm": (..._args: never[]) => undefined,
  "onChangeSubjectId": (..._args: never[]) => undefined,
  "onClickAbilityRow": (..._args: never[]) => undefined,
  "onClickCreateButton": (..._args: never[]) => undefined,
  "onClickResetFiltersButton": (..._args: never[]) => undefined,
  "subjects": [{
  "id": "item-1",
  "label": "샘플 label 1",
}, {
  "id": "item-1",
  "label": "샘플 label 1",
}],
  "totalCount": 12,
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const emptyStateArgs = {
  ...defaultArgs,
  "abilities": [],
  "actions": [],
  "subjects": [],
  "totalCount": 0,
};

const meta = {
  component: AbilityListPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof AbilityListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const EmptyState: Story = {
  args: emptyStateArgs as never,
};

import type { Meta, StoryObj } from "@storybook/react";
import { createStorybookMock } from "../storybookMock";
import { RoleDetailPage } from "./RoleDetailPage";

const defaultArgs = {
  "allAdvancedAbilities": [{
  "action": {
  "displayName": createStorybookMock("displayName") as never,
  "id": "item-1",
},
  "actionId": "action-1",
  "conditions": {},
  "description": "스토리북에서 확인할 description 예시입니다.",
  "fields": ["field-1", "field-1"],
  "id": "item-1",
  "inverted": false,
  "reason": "스토리북에서 확인할 reason 예시입니다.",
  "subject": {
  "displayName": createStorybookMock("displayName") as never,
  "id": "item-1",
},
  "subjectId": "subject-1",
}, {
  "action": {
  "displayName": createStorybookMock("displayName") as never,
  "id": "item-1",
},
  "actionId": "action-1",
  "conditions": {},
  "description": "스토리북에서 확인할 description 예시입니다.",
  "fields": ["field-1", "field-1"],
  "id": "item-1",
  "inverted": false,
  "reason": "스토리북에서 확인할 reason 예시입니다.",
  "subject": {
  "displayName": createStorybookMock("displayName") as never,
  "id": "item-1",
},
  "subjectId": "subject-1",
}],
  "changeSummary": {
  "added": 1,
  "kept": 1,
  "removed": 1,
},
  "crudBundles": [{
  "actions": [{
  "action": createStorybookMock("action") as never,
  "isAvailable": createStorybookMock("isAvailable") as never,
  "isSelected": createStorybookMock("isSelected") as never,
  "issueMessage": createStorybookMock("issueMessage") as never,
  "label": "샘플 label 1",
}, {
  "action": createStorybookMock("action") as never,
  "isAvailable": createStorybookMock("isAvailable") as never,
  "isSelected": createStorybookMock("isSelected") as never,
  "issueMessage": createStorybookMock("issueMessage") as never,
  "label": "샘플 label 1",
}],
  "availableCount": 12,
  "bundleId": "bundle-1",
  "bundleLabel": "샘플 bundle label 1",
  "description": "스토리북에서 확인할 description 예시입니다.",
  "groupLabel": "샘플 group label 1",
  "selectedCount": 12,
  "subject": "subject-1",
  "subjectLabel": "샘플 subject label 1",
}, {
  "actions": [{
  "action": createStorybookMock("action") as never,
  "isAvailable": createStorybookMock("isAvailable") as never,
  "isSelected": createStorybookMock("isSelected") as never,
  "issueMessage": createStorybookMock("issueMessage") as never,
  "label": "샘플 label 1",
}, {
  "action": createStorybookMock("action") as never,
  "isAvailable": createStorybookMock("isAvailable") as never,
  "isSelected": createStorybookMock("isSelected") as never,
  "issueMessage": createStorybookMock("issueMessage") as never,
  "label": "샘플 label 1",
}],
  "availableCount": 12,
  "bundleId": "bundle-1",
  "bundleLabel": "샘플 bundle label 1",
  "description": "스토리북에서 확인할 description 예시입니다.",
  "groupLabel": "샘플 group label 1",
  "selectedCount": 12,
  "subject": "subject-1",
  "subjectLabel": "샘플 subject label 1",
}],
  "grantedAdvancedAbilities": [{
  "action": {
  "displayName": createStorybookMock("displayName") as never,
  "id": "item-1",
},
  "actionId": "action-1",
  "conditions": {},
  "description": "스토리북에서 확인할 description 예시입니다.",
  "fields": ["field-1", "field-1"],
  "id": "item-1",
  "inverted": false,
  "reason": "스토리북에서 확인할 reason 예시입니다.",
  "subject": {
  "displayName": createStorybookMock("displayName") as never,
  "id": "item-1",
},
  "subjectId": "subject-1",
}, {
  "action": {
  "displayName": createStorybookMock("displayName") as never,
  "id": "item-1",
},
  "actionId": "action-1",
  "conditions": {},
  "description": "스토리북에서 확인할 description 예시입니다.",
  "fields": ["field-1", "field-1"],
  "id": "item-1",
  "inverted": false,
  "reason": "스토리북에서 확인할 reason 예시입니다.",
  "subject": {
  "displayName": createStorybookMock("displayName") as never,
  "id": "item-1",
},
  "subjectId": "subject-1",
}],
  "hasBlockingPageDiagnostics": false,
  "hasBlockingPermissionDiagnostics": false,
  "hasChanges": false,
  "hasGlobalAccess": false,
  "isDeleteModalOpen": false,
  "isDeleting": false,
  "isEditingGrants": false,
  "isLoading": false,
  "isLoadingAbilities": false,
  "isLoadingAllAbilities": false,
  "isLoadingCrudBundles": false,
  "isLoadingMenuPermissions": false,
  "isLoadingPagePermissions": false,
  "isSaveModalOpen": false,
  "isSavingGrants": false,
  "menuDiagnostics": [{
  "description": "스토리북에서 확인할 description 예시입니다.",
  "id": "item-1",
  "relatedAbilities": [{
  "href": createStorybookMock("href") as never,
  "id": createStorybookMock("id") as never,
  "isPreferred": createStorybookMock("isPreferred") as never,
  "label": createStorybookMock("label") as never,
}, {
  "href": createStorybookMock("href") as never,
  "id": createStorybookMock("id") as never,
  "isPreferred": createStorybookMock("isPreferred") as never,
  "label": createStorybookMock("label") as never,
}],
  "severity": "warning",
  "technicalDetails": ["technical-detail-1", "technical-detail-1"],
  "title": "샘플 title",
}, {
  "description": "스토리북에서 확인할 description 예시입니다.",
  "id": "item-1",
  "relatedAbilities": [{
  "href": createStorybookMock("href") as never,
  "id": createStorybookMock("id") as never,
  "isPreferred": createStorybookMock("isPreferred") as never,
  "label": createStorybookMock("label") as never,
}, {
  "href": createStorybookMock("href") as never,
  "id": createStorybookMock("id") as never,
  "isPreferred": createStorybookMock("isPreferred") as never,
  "label": createStorybookMock("label") as never,
}],
  "severity": "warning",
  "technicalDetails": ["technical-detail-1", "technical-detail-1"],
  "title": "샘플 title",
}],
  "menuPermissions": [{
  "groupId": "샘플 group id 1",
  "groupLabel": "샘플 group label 1",
  "isSelected": false,
  "issues": [{
  "code": createStorybookMock("code") as never,
  "message": "스토리북에서 확인할 message 예시입니다.",
  "relatedAbilities": createStorybookMock("relatedAbilities") as never,
  "severity": createStorybookMock("severity") as never,
  "technicalDetails": createStorybookMock("technicalDetails") as never,
}, {
  "code": createStorybookMock("code") as never,
  "message": "스토리북에서 확인할 message 예시입니다.",
  "relatedAbilities": createStorybookMock("relatedAbilities") as never,
  "severity": createStorybookMock("severity") as never,
  "technicalDetails": createStorybookMock("technicalDetails") as never,
}],
  "leafId": "leaf-1",
  "leafLabel": "샘플 leaf label 1",
  "path": "path-1",
  "requiredSubjects": ["required-subject-1", "required-subject-1"],
}, {
  "groupId": "샘플 group id 1",
  "groupLabel": "샘플 group label 1",
  "isSelected": false,
  "issues": [{
  "code": createStorybookMock("code") as never,
  "message": "스토리북에서 확인할 message 예시입니다.",
  "relatedAbilities": createStorybookMock("relatedAbilities") as never,
  "severity": createStorybookMock("severity") as never,
  "technicalDetails": createStorybookMock("technicalDetails") as never,
}, {
  "code": createStorybookMock("code") as never,
  "message": "스토리북에서 확인할 message 예시입니다.",
  "relatedAbilities": createStorybookMock("relatedAbilities") as never,
  "severity": createStorybookMock("severity") as never,
  "technicalDetails": createStorybookMock("technicalDetails") as never,
}],
  "leafId": "leaf-1",
  "leafLabel": "샘플 leaf label 1",
  "path": "path-1",
  "requiredSubjects": ["required-subject-1", "required-subject-1"],
}],
  "onChangeGrantPriorityInput": (..._args: never[]) => undefined,
  "onClickBackButton": (..._args: never[]) => undefined,
  "onClickCancelEditGrantsButton": (..._args: never[]) => undefined,
  "onClickConfirmSaveGrantsButton": (..._args: never[]) => undefined,
  "onClickDeleteConfirm": (..._args: never[]) => undefined,
  "onClickEditButton": (..._args: never[]) => undefined,
  "onClickEditGrantsButton": (..._args: never[]) => undefined,
  "onClickOpenAbilityDetail": (..._args: never[]) => undefined,
  "onClickOpenDeleteModal": (..._args: never[]) => undefined,
  "onClickOpenSaveGrantsModal": (..._args: never[]) => undefined,
  "onCloseDeleteModal": (..._args: never[]) => undefined,
  "onCloseSaveGrantsModal": (..._args: never[]) => undefined,
  "onToggleAbilityCheckbox": (..._args: never[]) => undefined,
  "onToggleCrudAction": (..._args: never[]) => undefined,
  "onToggleGrantActiveSwitch": (..._args: never[]) => undefined,
  "onToggleMenuPermission": (..._args: never[]) => undefined,
  "onTogglePagePermission": (..._args: never[]) => undefined,
  "pageDiagnostics": [{
  "description": "스토리북에서 확인할 description 예시입니다.",
  "id": "item-1",
  "relatedAbilities": [{
  "href": createStorybookMock("href") as never,
  "id": createStorybookMock("id") as never,
  "isPreferred": createStorybookMock("isPreferred") as never,
  "label": createStorybookMock("label") as never,
}, {
  "href": createStorybookMock("href") as never,
  "id": createStorybookMock("id") as never,
  "isPreferred": createStorybookMock("isPreferred") as never,
  "label": createStorybookMock("label") as never,
}],
  "severity": "warning",
  "technicalDetails": ["technical-detail-1", "technical-detail-1"],
  "title": "샘플 title",
}, {
  "description": "스토리북에서 확인할 description 예시입니다.",
  "id": "item-1",
  "relatedAbilities": [{
  "href": createStorybookMock("href") as never,
  "id": createStorybookMock("id") as never,
  "isPreferred": createStorybookMock("isPreferred") as never,
  "label": createStorybookMock("label") as never,
}, {
  "href": createStorybookMock("href") as never,
  "id": createStorybookMock("id") as never,
  "isPreferred": createStorybookMock("isPreferred") as never,
  "label": createStorybookMock("label") as never,
}],
  "severity": "warning",
  "technicalDetails": ["technical-detail-1", "technical-detail-1"],
  "title": "샘플 title",
}],
  "pagePermissions": [{
  "groupId": "샘플 group id 1",
  "groupLabel": "샘플 group label 1",
  "isSelected": false,
  "issues": [{
  "code": createStorybookMock("code") as never,
  "message": "스토리북에서 확인할 message 예시입니다.",
  "relatedAbilities": createStorybookMock("relatedAbilities") as never,
  "severity": createStorybookMock("severity") as never,
  "technicalDetails": createStorybookMock("technicalDetails") as never,
}, {
  "code": createStorybookMock("code") as never,
  "message": "스토리북에서 확인할 message 예시입니다.",
  "relatedAbilities": createStorybookMock("relatedAbilities") as never,
  "severity": createStorybookMock("severity") as never,
  "technicalDetails": createStorybookMock("technicalDetails") as never,
}],
  "pageId": "page-1",
  "pageLabel": "샘플 page label 1",
  "pathPattern": "path-pattern-1",
}, {
  "groupId": "샘플 group id 1",
  "groupLabel": "샘플 group label 1",
  "isSelected": false,
  "issues": [{
  "code": createStorybookMock("code") as never,
  "message": "스토리북에서 확인할 message 예시입니다.",
  "relatedAbilities": createStorybookMock("relatedAbilities") as never,
  "severity": createStorybookMock("severity") as never,
  "technicalDetails": createStorybookMock("technicalDetails") as never,
}, {
  "code": createStorybookMock("code") as never,
  "message": "스토리북에서 확인할 message 예시입니다.",
  "relatedAbilities": createStorybookMock("relatedAbilities") as never,
  "severity": createStorybookMock("severity") as never,
  "technicalDetails": createStorybookMock("technicalDetails") as never,
}],
  "pageId": "page-1",
  "pageLabel": "샘플 page label 1",
  "pathPattern": "path-pattern-1",
}],
  "role": {
  "createdAt": "2026-04-14T09:00:00.000Z",
  "description": "스토리북에서 확인할 description 예시입니다.",
  "displayName": "샘플 display name 1",
  "id": "item-1",
  "isSystem": false,
  "removedAt": "2026-04-14T09:00:00.000Z",
  "updatedAt": "2026-04-14T09:00:00.000Z",
},
  "selectedGrantItems": {},
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const busyArgs = {
  ...defaultArgs,
  "isDeleting": true,
};

const emptyStateArgs = {
  ...defaultArgs,
  "allAdvancedAbilities": [],
  "crudBundles": [],
  "grantedAdvancedAbilities": [],
  "menuDiagnostics": [],
  "menuPermissions": [],
  "pageDiagnostics": [],
  "pagePermissions": [],
};

const meta = {
  component: RoleDetailPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof RoleDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const Busy: Story = {
  args: busyArgs as never,
};

export const EmptyState: Story = {
  args: emptyStateArgs as never,
};

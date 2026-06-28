import type { Meta, StoryObj } from "@storybook/react";
import { TaskCreateScreen } from "./TaskCreateScreen";

const defaultArgs = {
	assetBrowserDescription:
		"스토리북에서 확인할 asset browser description 예시입니다.",
	assetBrowserProps: {
		assets: [
			{
				createdAt: "2026-04-14T09:00:00.000Z",
				id: "item-1",
				kind: "IMAGE",
				mimeType: "샘플 mime type 1",
				originalName: "샘플 original name 1",
				publicUrl: "https://example.com/public-url-1",
				sizeBytes: 1024,
				status: "UPLOADING",
			},
			{
				createdAt: "2026-04-14T09:00:00.000Z",
				id: "item-1",
				kind: "IMAGE",
				mimeType: "샘플 mime type 1",
				originalName: "샘플 original name 1",
				publicUrl: "https://example.com/public-url-1",
				sizeBytes: 1024,
				status: "UPLOADING",
			},
		],
		folders: [
			{
				id: "item-1",
				parentFolderId: "parent-folder-1",
			},
			{
				id: "item-1",
				parentFolderId: "parent-folder-1",
			},
		],
		hasSelectedSpace: false,
		isCreatingFolder: false,
		isLoading: false,
		isRemoving: false,
		isRemovingFolder: false,
		isStoreReady: false,
		isUpdatingFolder: false,
		isUploadingAsset: false,
		onCreateFolder: async (..._args: never[]) => undefined,
		onDeleteAsset: async (..._args: never[]) => undefined,
		onDeleteFolder: async (..._args: never[]) => undefined,
		onRenameFolder: async (..._args: never[]) => undefined,
		onUploadAsset: async (..._args: never[]) => undefined,
		queryStates: { page: 1, take: 10, skip: 0, search: "" },
		setQueryStates: (..._args: never[]) => undefined,
		totalCount: 12,
	},
	assetBrowserSelectedAssetId: "asset-browser-selected-asset-1",
	assetBrowserTitle: "샘플 asset browser title",
	count: 12,
	description: "스토리북에서 확인할 description 예시입니다.",
	durationMin: 15,
	durationSec: 15,
	errors: {},
	isAssetBrowserOpen: false,
	isSchedulable: false,
	isSubmitPending: false,
	onChangeCountInput: (..._args: never[]) => undefined,
	onChangeDescriptionTextArea: (..._args: never[]) => undefined,
	onChangeDurationMinInput: (..._args: never[]) => undefined,
	onChangeDurationSecInput: (..._args: never[]) => undefined,
	onChangeImageFileIdInput: (..._args: never[]) => undefined,
	onChangeNameInput: (..._args: never[]) => undefined,
	onChangeVideoFileIdInput: (..._args: never[]) => undefined,
	onClickCancelButton: (..._args: never[]) => undefined,
	onClickClearImageAssetButton: (..._args: never[]) => undefined,
	onClickClearVideoAssetButton: (..._args: never[]) => undefined,
	onClickSaveButton: (..._args: never[]) => undefined,
	onCloseAssetBrowser: (..._args: never[]) => undefined,
	onOpenImagePicker: (..._args: never[]) => undefined,
	onOpenVideoPicker: (..._args: never[]) => undefined,
	onSelectAssetFromBrowser: (..._args: never[]) => undefined,
	selectedImageAsset: {
		createdAt: "2026-04-14T09:00:00.000Z",
		id: "item-1",
		kind: "IMAGE",
		mimeType: "샘플 mime type 1",
		originalName: "샘플 original name 1",
		publicUrl: "https://example.com/public-url-1",
		sizeBytes: 1024,
		status: "UPLOADING",
	},
	selectedVideoAsset: {
		createdAt: "2026-04-14T09:00:00.000Z",
		id: "item-1",
		kind: "IMAGE",
		mimeType: "샘플 mime type 1",
		originalName: "샘플 original name 1",
		publicUrl: "https://example.com/public-url-1",
		sizeBytes: 1024,
		status: "UPLOADING",
	},
};

const busyArgs = {
	...defaultArgs,
	isSubmitPending: true,
};

const meta = {
	title: "screen/TaskCreateScreen",
	component: TaskCreateScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof TaskCreateScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
	args: busyArgs as never,
};

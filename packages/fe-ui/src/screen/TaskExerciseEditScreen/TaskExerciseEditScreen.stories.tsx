import type { Meta, StoryObj } from "@storybook/react";
import { TaskExerciseEditScreen } from "./TaskExerciseEditScreen";

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
	contentLanguageCode: "ko_KR",
	description: "스토리북에서 확인할 description 예시입니다.",
	isAssetBrowserOpen: false,
	isLoading: false,
	isNotFound: false,
	isSubmitPending: false,
	readOnly: false,
	onClickCancelButton: (..._args: never[]) => undefined,
	onClickClearImageAssetButton: (..._args: never[]) => undefined,
	onClickClearVideoAssetButton: (..._args: never[]) => undefined,
	onClickSaveButton: (..._args: never[]) => undefined,
	onCloseAssetBrowser: (..._args: never[]) => undefined,
	onOpenImagePicker: (..._args: never[]) => undefined,
	onOpenVideoPicker: (..._args: never[]) => undefined,
	onSelectAssetFromBrowser: (..._args: never[]) => undefined,
	state: {
		count: 12,
		description: "스토리북에서 확인할 description 예시입니다.",
		durationMin: 15,
		durationSec: 15,
		errors: {},
		imageFileId: "image-file-1",
		name: "샘플 exercise name 1",
		videoFileId: "video-file-1",
	},
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
	title: "운동 정보 수정",
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
	actions: null,
	description: "태스크에 연결된 운동 detail입니다.",
	metadata: {
		createdAt: "2026-04-14T09:00:00.000Z",
		routines: [
			{
				createdAt: "2026-04-14T09:00:00.000Z",
				id: "routine-1",
				label: "입문",
				name: "기초 루틴",
			},
		],
		taskId: "task-1",
		tenantId: "space-1",
		updatedAt: "2026-04-15T09:00:00.000Z",
	},
	readOnly: true,
	title: "샘플 exercise name 1",
};

const meta = {
	title: "screen/TaskExerciseEditScreen",
	component: TaskExerciseEditScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof TaskExerciseEditScreen>;

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

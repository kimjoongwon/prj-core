import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TaskExerciseEditScreen } from "./TaskExerciseEditScreen";

const defaultArgs: ComponentProps<typeof TaskExerciseEditScreen> = {
	assetBrowserDescription:
		"스토리북에서 확인할 asset browser description 예시입니다.",
	assetBrowserProps: {
		assets: [
			{
				createdAt: "2026-04-14T09:00:00.000Z",
				id: "item-1",
				kind: "IMAGE",
				spaceId: "1",
				folderId: "1",
				storageKey: "exercise-image-1",
				extension: "png",
				checksum: null,
				metadata: null,
				createdById: null,
				updatedAt: "2026-04-14T09:00:00.000Z",
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
				spaceId: "1",
				folderId: "1",
				storageKey: "exercise-image-1",
				extension: "png",
				checksum: null,
				metadata: null,
				createdById: null,
				updatedAt: "2026-04-14T09:00:00.000Z",
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
				name: "운동 자료",
				parentFolderId: "parent-folder-1",
			},
			{
				id: "item-1",
				name: "운동 자료",
				parentFolderId: "parent-folder-1",
			},
		],
		hasSelectedSpace: false,
		isCreatingFolder: false,
		isLoading: false,
		isRemoving: false,
		isRemovingFolder: false,
		isSpaceReady: false,
		isUpdatingFolder: false,
		isUploadingAsset: false,
		onCreateFolder: async () => undefined,
		onDeleteAsset: async () => undefined,
		onDeleteFolder: async () => undefined,
		onRenameFolder: async () => undefined,
		onUploadAsset: async () => undefined,
		queryStates: { page: 1, take: 10, skip: 0, search: "", kind: "", status: "", folderId: "" },
		setQueryStates: async () => new URLSearchParams(),
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
	onClickCancelButton: () => undefined,
	onClickClearImageAssetButton: () => undefined,
	onClickClearVideoAssetButton: () => undefined,
	onClickSaveButton: () => undefined,
	onCloseAssetBrowser: () => undefined,
	onOpenImagePicker: () => undefined,
	onOpenVideoPicker: () => undefined,
	onSelectAssetFromBrowser: () => undefined,
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
		spaceId: "1",
		folderId: "1",
		storageKey: "exercise-image-1",
		extension: "png",
		checksum: null,
		metadata: null,
		createdById: null,
		updatedAt: "2026-04-14T09:00:00.000Z",
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
		spaceId: "1",
		folderId: "1",
		storageKey: "exercise-image-1",
		extension: "png",
		checksum: null,
		metadata: null,
		createdById: null,
		updatedAt: "2026-04-14T09:00:00.000Z",
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
		createdAt: new Date("2026-04-14T09:00:00.000Z"),
		routines: [
			{
				createdAt: new Date("2026-04-14T09:00:00.000Z"),
				id: 1n,
				label: "입문",
				name: "기초 루틴",
			},
		],
		taskId: 1n,
		spaceId: 1n,
		updatedAt: new Date("2026-04-15T09:00:00.000Z"),
	},
	readOnly: true,
	title: "샘플 exercise name 1",
};

const meta = {
	title: "screen/TaskExerciseEditScreen",
	component: TaskExerciseEditScreen,
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		metadata: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof TaskExerciseEditScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs,
};

export const NotFound: Story = {
	args: notFoundArgs,
};

export const Busy: Story = {
	args: busyArgs,
};

export const ReadOnly: Story = {
	args: readOnlyArgs,
};

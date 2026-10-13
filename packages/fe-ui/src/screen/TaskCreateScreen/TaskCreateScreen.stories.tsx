import type { Meta, StoryObj } from "@storybook/react";
import {
	AssetBrowser,
	type AssetBrowserAsset,
} from "../../domain/asset/AssetBrowser";
import {
	TaskCreateScreen,
	type TaskCreateScreenProps,
} from "./TaskCreateScreen";

const sampleImageAsset: AssetBrowserAsset = {
	id: "item-1",
	spaceId: "1",
	folderId: "1",
	kind: "IMAGE",
	status: "UPLOADING",
	originalName: "샘플 이미지",
	storageKey: "sample-image",
	extension: "png",
	checksum: null,
	metadata: null,
	createdById: null,
	mimeType: "image/png",
	publicUrl: "https://example.com/public-url-1",
	sizeBytes: 1024,
	createdAt: "2026-04-14T09:00:00.000Z",
	updatedAt: "2026-04-14T09:00:00.000Z",
};

const defaultArgs: TaskCreateScreenProps = {
	name: "샘플 운동명",
	assetBrowser: (
		<AssetBrowser
			mode="picker"
			title="에셋 선택"
			description="스토리북에서 확인할 에셋 브라우저입니다."
			{...{
				assets: [sampleImageAsset],
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
				queryStates: {
					take: 10,
					skip: 0,
					search: "",
					kind: "",
					status: "",
					folderId: "",
				},
				setQueryStates: async () => new URLSearchParams(),
				totalCount: 12,
			}}
		/>
	),
	assetBrowserTitle: "샘플 asset browser title",
	count: 12,
	description: "스토리북에서 확인할 description 예시입니다.",
	durationMin: 15,
	durationSec: 15,
	errors: {},
	isAssetBrowserOpen: false,
	isSchedulable: false,
	isSubmitPending: false,
	onChangeCountInput: () => undefined,
	onChangeDescriptionTextArea: () => undefined,
	onChangeDurationMinInput: () => undefined,
	onChangeDurationSecInput: () => undefined,
	onChangeImageFileIdInput: () => undefined,
	onChangeNameInput: () => undefined,
	onChangeVideoFileIdInput: () => undefined,
	onClickCancelButton: () => undefined,
	onClickClearImageAssetButton: () => undefined,
	onClickClearVideoAssetButton: () => undefined,
	onClickSaveButton: () => undefined,
	onCloseAssetBrowser: () => undefined,
	onOpenImagePicker: () => undefined,
	onOpenVideoPicker: () => undefined,
	selectedImageAsset: sampleImageAsset,
	selectedVideoAsset: sampleImageAsset,
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
	args: defaultArgs,
} satisfies Meta<typeof TaskCreateScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
	args: busyArgs,
};

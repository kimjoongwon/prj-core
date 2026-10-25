import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";
import { AssetBrowser } from "../../domain/asset/AssetBrowser";
import { TaskExerciseEditScreen } from "./TaskExerciseEditScreen";
import { useStorybookState } from "../../storybook";

const defaultArgs: ComponentProps<typeof TaskExerciseEditScreen> = {
	assetBrowser: (
		<AssetBrowser
			mode="picker"
			title="에셋 선택"
			description="스토리북에서 확인할 에셋 브라우저입니다."
			{...{
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
					page: 1,
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
type TaskExerciseEditStoryState = ComponentProps<typeof TaskExerciseEditScreen>["state"];
type TaskExerciseEditScreenStoryState = NonNullable<TaskExerciseEditStoryState> & {
	isAssetBrowserOpen: boolean;
	selectedImageAsset?: ComponentProps<typeof TaskExerciseEditScreen>["selectedImageAsset"];
	selectedVideoAsset?: ComponentProps<typeof TaskExerciseEditScreen>["selectedVideoAsset"];
	openAssetBrowser: () => void;
	closeAssetBrowser: () => void;
	clearImageAsset: () => void;
	clearVideoAsset: () => void;
};
export const createTaskExerciseEditScreenStoryState = (
	initial: TaskExerciseEditStoryState,
	selectedImageAsset?: ComponentProps<typeof TaskExerciseEditScreen>["selectedImageAsset"],
	selectedVideoAsset?: ComponentProps<typeof TaskExerciseEditScreen>["selectedVideoAsset"],
) => {
	let state: TaskExerciseEditScreenStoryState;
	state = makeAutoObservable({
		...initial,
		errors: { ...initial.errors },
		isAssetBrowserOpen: false,
		selectedImageAsset,
		selectedVideoAsset,
		openAssetBrowser: () => { state.isAssetBrowserOpen = true; },
		closeAssetBrowser: () => { state.isAssetBrowserOpen = false; },
		clearImageAsset: () => { state.imageFileId = ""; state.selectedImageAsset = undefined; },
		clearVideoAsset: () => { state.videoFileId = ""; state.selectedVideoAsset = undefined; },
	}, {}, { autoBind: true, name: "TaskExerciseEditScreenStoryState" }) as TaskExerciseEditScreenStoryState;
	return state;
};
export const TaskExerciseEditScreenStoryHarness = observer(function TaskExerciseEditScreenStoryHarness({
	args,
}: { args: ComponentProps<typeof TaskExerciseEditScreen> }) {
	const state = useLocalObservable(() =>
		createTaskExerciseEditScreenStoryState(
			args.state,
			args.selectedImageAsset,
			args.selectedVideoAsset,
		),
	);
	useStorybookState(() => ({ name: state.name, imageFileId: state.imageFileId, videoFileId: state.videoFileId, selectedImageAssetId: state.selectedImageAsset?.id ?? null, selectedVideoAssetId: state.selectedVideoAsset?.id ?? null, isAssetBrowserOpen: state.isAssetBrowserOpen }), "TaskExerciseEditScreen");
	return (
		<TaskExerciseEditScreen
			{...args}
			state={state}
			selectedImageAsset={state.selectedImageAsset}
			selectedVideoAsset={state.selectedVideoAsset}
			isAssetBrowserOpen={state.isAssetBrowserOpen}
			onOpenImagePicker={state.openAssetBrowser}
			onOpenVideoPicker={state.openAssetBrowser}
			onCloseAssetBrowser={state.closeAssetBrowser}
			onClickClearImageAssetButton={state.clearImageAsset}
			onClickClearVideoAssetButton={state.clearVideoAsset}
		/>
	);
});
const renderTaskExerciseEditScreen = (args: ComponentProps<typeof TaskExerciseEditScreen>) => (
	<TaskExerciseEditScreenStoryHarness args={args} />
);

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
				id: "01J00000000000000000000001",
				label: "입문",
				name: "기초 루틴",
			},
		],
		taskId: "01J00000000000000000000001",
		spaceId: "01J00000000000000000000001",
		updatedAt: new Date("2026-04-15T09:00:00.000Z"),
	},
	readOnly: true,
	title: "샘플 exercise name 1",
};

const meta = {
	title: "screen/TaskExerciseEditScreen",
	component: TaskExerciseEditScreen,
	excludeStories: ["createTaskExerciseEditScreenStoryState", "TaskExerciseEditScreenStoryHarness"],
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		metadata: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
	render: renderTaskExerciseEditScreen,
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

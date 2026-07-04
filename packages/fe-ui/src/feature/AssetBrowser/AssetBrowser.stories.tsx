import type { Meta, StoryObj } from "@storybook/react";
import { AssetBrowser } from "./AssetBrowser";

const queryStates = {
	take: 10,
	skip: 0,
	search: "",
	kind: "",
	status: "",
	folderId: "",
};
const folders = [
	{ id: "shared", name: "공용 자료" },
	{ id: "program", name: "프로그램 이미지", parentFolderId: "shared" },
];

const baseArgs = {
	mode: "manage",
	presentation: "inline",
	title: "에셋 관리",
	description: "프로그램과 공지에서 사용할 파일을 관리합니다.",
	assets: [] as never,
	totalCount: 0,
	folders,
	queryStates,
	setQueryStates: async () => new URLSearchParams(),
	isLoading: false,
	isStoreReady: true,
	hasSelectedSpace: true,
	isRemoving: false,
	isUploadingAsset: false,
	isCreatingFolder: false,
	isUpdatingFolder: false,
	isRemovingFolder: false,
	onUploadAsset: async () => undefined,
	onDeleteAsset: async () => undefined,
	onCreateFolder: async () => undefined,
	onRenameFolder: async () => undefined,
	onDeleteFolder: async () => undefined,
} as const;

const meta = {
	title: "feature/AssetBrowser",
	component: AssetBrowser,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: baseArgs,
} satisfies Meta<typeof AssetBrowser>;

export default meta;
type Story = StoryObj<typeof meta>;
export const ManageEmpty: Story = {
	render: (args) => (
		<div className="min-h-screen bg-surface-secondary p-6">
			<AssetBrowser {...args} />
		</div>
	),
};
export const SpaceRequired: Story = {
	args: { hasSelectedSpace: false },
	render: ManageEmpty.render,
};
export const PickerModal: Story = {
	args: {
		mode: "picker",
		presentation: "modal",
		isOpen: true,
		onClose: () => undefined,
		onSelectAsset: () => undefined,
	},
	render: ManageEmpty.render,
};

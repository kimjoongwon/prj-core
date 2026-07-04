import type { Meta, StoryObj } from "@storybook/react";
import { AssetPreview, AssetPreviewDialog } from "./AssetPreview";

const imageAsset = {
	id: "asset-image",
	originalName: "studio-main.jpg",
	kind: "IMAGE",
	status: "READY",
	mimeType: "image/jpeg",
	sizeBytes: 1_240_000,
	publicUrl:
		"https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80",
} as const;
const documentAsset = {
	id: "asset-doc",
	originalName: "policy.hwp",
	kind: "DOCUMENT",
	status: "READY",
	mimeType: "application/x-hwp",
	sizeBytes: 240_000,
	publicUrl: "/document.hwp",
} as const;

const meta = {
	title: "widget/AssetPreview",
	component: AssetPreview,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { asset: imageAsset, showInfo: true },
} satisfies Meta<typeof AssetPreview>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Image: Story = {
	render: (args) => (
		<div className="w-[520px]">
			<AssetPreview {...args} />
		</div>
	),
};
export const UnsupportedDocument: Story = {
	args: { asset: documentAsset },
	render: Image.render,
};
export const DialogOpen: Story = {
	render: () => (
		<AssetPreviewDialog asset={imageAsset} isOpen onClose={() => undefined} />
	),
};

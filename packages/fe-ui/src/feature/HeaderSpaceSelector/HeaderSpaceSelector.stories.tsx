import type { Meta, StoryObj } from "@storybook/react";
import { HeaderSpaceSelector } from "./HeaderSpaceSelector";

const spaces = [
	{
		tenantId: "tenant-gangnam",
		spaceId: "space-gangnam",
		groundName: "강남 스페이스",
	},
	{
		tenantId: "tenant-hongdae",
		spaceId: "space-hongdae",
		groundName: "홍대 스페이스",
	},
];

const meta = {
	title: "feature/HeaderSpaceSelector",
	component: HeaderSpaceSelector,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		spaces,
		currentTenantId: "tenant-gangnam",
		currentSpaceName: "강남 스페이스",
		onSpaceSelect: () => undefined,
	},
} satisfies Meta<typeof HeaderSpaceSelector>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = {
	args: { spaces: [], currentTenantId: null, currentSpaceName: null },
};

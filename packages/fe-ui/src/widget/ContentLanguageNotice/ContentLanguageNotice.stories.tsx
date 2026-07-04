import type { Meta, StoryObj } from "@storybook/react";
import { ContentLanguageNotice } from "./ContentLanguageNotice";

const meta = {
	title: "widget/ContentLanguageNotice",
	component: ContentLanguageNotice,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { contentLanguageCode: "ko_KR" },
} satisfies Meta<typeof ContentLanguageNotice>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Korean: Story = {};
export const English: Story = { args: { contentLanguageCode: "en_US" } };
export const Missing: Story = { args: { contentLanguageCode: null } };

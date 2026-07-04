import { LanguageCode } from "@cocrepo/constant";
import type { Meta, StoryObj } from "@storybook/react";
import { LanguageSelectButton } from "./LanguageSelectButton";

const meta = {
	title: "feature/LanguageSelectButton",
	component: LanguageSelectButton,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { value: LanguageCode.ko_KR, onChange: () => undefined },
} satisfies Meta<typeof LanguageSelectButton>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: { compact: true } };
export const Disabled: Story = { args: { isDisabled: true } };

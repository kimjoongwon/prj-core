import type { Meta, StoryObj } from "@storybook/react";
import { LanguageSelectButton } from "./LanguageSelectButton";

const meta = {
	title: "domain/language/LanguageSelectButton",
	component: LanguageSelectButton,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof LanguageSelectButton>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

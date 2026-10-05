import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StaticTranslationListScreen } from "./StaticTranslationListScreen";

const defaultArgs: ComponentProps<typeof StaticTranslationListScreen> = {
	isLoading: false,
	onCreateTranslation: () => Promise.resolve(),
	onDeleteTranslation: () => Promise.resolve(),
	onInvalidateAllTranslationCache: () => Promise.resolve(),
	onInvalidateTranslationCache: () => Promise.resolve(),
	onUpdateTranslation: () => Promise.resolve(),
	queryStates: {
		take: 20,
		skip: 0,
		key: "",
		category: "",
		languageCode: "",
		isTranslated: "",
	},
	setQueryStates: () => Promise.resolve(new URLSearchParams()),
	totalCount: 3,
	translations: [
		{
			id: "translation-1",
			languageCode: "ko_KR",
			key: "정적 번역",
			text: "정적 번역",
			category: "공통",
			isTranslated: true,
			createdAt: new Date("2026-05-01T00:00:00.000Z"),
			updatedAt: new Date("2026-05-01T00:00:00.000Z"),
		},
		{
			id: "translation-2",
			languageCode: "en_US",
			key: "정적 번역",
			text: "Static translations",
			category: "공통",
			isTranslated: true,
			createdAt: new Date("2026-05-01T00:00:00.000Z"),
			updatedAt: new Date("2026-05-01T00:00:00.000Z"),
		},
		{
			id: "translation-3",
			languageCode: "ja_JP",
			key: "정적 번역",
			text: "静的翻訳",
			category: "공통",
			isTranslated: false,
			createdAt: new Date("2026-05-01T00:00:00.000Z"),
			updatedAt: new Date("2026-05-01T00:00:00.000Z"),
		},
	],
};

const meta = {
	title: "screen/StaticTranslationListScreen",
	component: StaticTranslationListScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof StaticTranslationListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: {
		...defaultArgs,
		isLoading: true,
	},
};

export const EmptyState: Story = {
	args: {
		...defaultArgs,
		totalCount: 0,
		translations: [],
	},
};

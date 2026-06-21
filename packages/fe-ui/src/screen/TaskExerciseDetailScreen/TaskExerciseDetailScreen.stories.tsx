import type { Meta, StoryObj } from "@storybook/react";
import { TaskExerciseDetailScreen } from "./TaskExerciseDetailScreen";

const defaultArgs = {
	exercise: {
		count: 12,
		createdAt: "2026-04-14T09:00:00.000Z",
		description: "스토리북에서 확인할 description 예시입니다.",
		duration: 15,
		imageAssetHref: {
			anchor: (..._args: never[]) => undefined,
			at: (..._args: never[]) => undefined,
			big: (..._args: never[]) => undefined,
			blink: (..._args: never[]) => undefined,
			bold: (..._args: never[]) => undefined,
			charAt: (..._args: never[]) => undefined,
			charCodeAt: (..._args: never[]) => undefined,
			codePointAt: (..._args: never[]) => undefined,
			concat: (..._args: never[]) => undefined,
			endsWith: (..._args: never[]) => undefined,
			fixed: (..._args: never[]) => undefined,
			fontcolor: (..._args: never[]) => undefined,
			fontsize: (..._args: never[]) => undefined,
			includes: (..._args: never[]) => undefined,
			indexOf: (..._args: never[]) => undefined,
			isWellFormed: (..._args: never[]) => undefined,
			italics: (..._args: never[]) => undefined,
			lastIndexOf: (..._args: never[]) => undefined,
			link: (..._args: never[]) => undefined,
			localeCompare: (..._args: never[]) => undefined,
			match: (..._args: never[]) => undefined,
			matchAll: (..._args: never[]) => undefined,
			normalize: (..._args: never[]) => undefined,
			padEnd: (..._args: never[]) => undefined,
			padStart: (..._args: never[]) => undefined,
			repeat: (..._args: never[]) => undefined,
			replace: (..._args: never[]) => undefined,
			replaceAll: (..._args: never[]) => undefined,
			search: "샘플",
			slice: (..._args: never[]) => undefined,
			small: (..._args: never[]) => undefined,
			split: (..._args: never[]) => undefined,
			startsWith: (..._args: never[]) => undefined,
			strike: (..._args: never[]) => undefined,
			sub: (..._args: never[]) => undefined,
			substr: (..._args: never[]) => undefined,
			substring: (..._args: never[]) => undefined,
			sup: (..._args: never[]) => undefined,
			toLocaleLowerCase: (..._args: never[]) => undefined,
			toLocaleUpperCase: (..._args: never[]) => undefined,
			toLowerCase: (..._args: never[]) => undefined,
			toString: (..._args: never[]) => undefined,
			toUpperCase: (..._args: never[]) => undefined,
			toWellFormed: (..._args: never[]) => undefined,
			trim: (..._args: never[]) => undefined,
			trimEnd: (..._args: never[]) => undefined,
			trimLeft: (..._args: never[]) => undefined,
			trimRight: (..._args: never[]) => undefined,
			trimStart: (..._args: never[]) => undefined,
			valueOf: (..._args: never[]) => undefined,
		},
		imageFileId: "image-file-1",
		tenantId: "space-1",
		updatedAt: "2026-04-14T09:00:00.000Z",
		videoAssetHref: {
			anchor: (..._args: never[]) => undefined,
			at: (..._args: never[]) => undefined,
			big: (..._args: never[]) => undefined,
			blink: (..._args: never[]) => undefined,
			bold: (..._args: never[]) => undefined,
			charAt: (..._args: never[]) => undefined,
			charCodeAt: (..._args: never[]) => undefined,
			codePointAt: (..._args: never[]) => undefined,
			concat: (..._args: never[]) => undefined,
			endsWith: (..._args: never[]) => undefined,
			fixed: (..._args: never[]) => undefined,
			fontcolor: (..._args: never[]) => undefined,
			fontsize: (..._args: never[]) => undefined,
			includes: (..._args: never[]) => undefined,
			indexOf: (..._args: never[]) => undefined,
			isWellFormed: (..._args: never[]) => undefined,
			italics: (..._args: never[]) => undefined,
			lastIndexOf: (..._args: never[]) => undefined,
			link: (..._args: never[]) => undefined,
			localeCompare: (..._args: never[]) => undefined,
			match: (..._args: never[]) => undefined,
			matchAll: (..._args: never[]) => undefined,
			normalize: (..._args: never[]) => undefined,
			padEnd: (..._args: never[]) => undefined,
			padStart: (..._args: never[]) => undefined,
			repeat: (..._args: never[]) => undefined,
			replace: (..._args: never[]) => undefined,
			replaceAll: (..._args: never[]) => undefined,
			search: "샘플",
			slice: (..._args: never[]) => undefined,
			small: (..._args: never[]) => undefined,
			split: (..._args: never[]) => undefined,
			startsWith: (..._args: never[]) => undefined,
			strike: (..._args: never[]) => undefined,
			sub: (..._args: never[]) => undefined,
			substr: (..._args: never[]) => undefined,
			substring: (..._args: never[]) => undefined,
			sup: (..._args: never[]) => undefined,
			toLocaleLowerCase: (..._args: never[]) => undefined,
			toLocaleUpperCase: (..._args: never[]) => undefined,
			toLowerCase: (..._args: never[]) => undefined,
			toString: (..._args: never[]) => undefined,
			toUpperCase: (..._args: never[]) => undefined,
			toWellFormed: (..._args: never[]) => undefined,
			trim: (..._args: never[]) => undefined,
			trimEnd: (..._args: never[]) => undefined,
			trimLeft: (..._args: never[]) => undefined,
			trimRight: (..._args: never[]) => undefined,
			trimStart: (..._args: never[]) => undefined,
			valueOf: (..._args: never[]) => undefined,
		},
		videoFileId: "video-file-1",
	},
	isDeleteModalOpen: false,
	isDeletePending: false,
	isLoading: false,
	isNotFound: false,
	isSchedulable: false,
	onClickBackButton: (..._args: never[]) => undefined,
	onClickDeleteButton: (..._args: never[]) => undefined,
	onClickDeleteCancelButton: (..._args: never[]) => undefined,
	onClickDeleteConfirmButton: (..._args: never[]) => undefined,
	onClickEditButton: (..._args: never[]) => undefined,
	routines: [
		{
			createdAt: "2026-04-14T09:00:00.000Z",
			id: "item-1",
			label: "샘플 label 1",
		},
		{
			createdAt: "2026-04-14T09:00:00.000Z",
			id: "item-1",
			label: "샘플 label 1",
		},
	],
	taskId: "task-1",
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const notFoundArgs = {
	...defaultArgs,
	isNotFound: true,
};

const emptyStateArgs = {
	...defaultArgs,
	routines: [],
};

const meta = {
	component: TaskExerciseDetailScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof TaskExerciseDetailScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const NotFound: Story = {
	args: notFoundArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};

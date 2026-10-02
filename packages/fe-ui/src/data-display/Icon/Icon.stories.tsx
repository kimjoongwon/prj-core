import type { Meta, StoryObj } from "@storybook/react";
import { DogPawIcon, InfoIcon, StarIcon, WarningIcon } from "./index";

const meta = {
	title: "data-display/Icon",
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta;

export default meta;

export const DogPaw: StoryObj = {
	render: () => <DogPawIcon size={24} />,
};

export const Warning: StoryObj = {
	render: () => <WarningIcon size={24} />,
};

export const Info: StoryObj = {
	render: () => <InfoIcon size={24} />,
};

export const Star: StoryObj = {
	render: () => <StarIcon size={24} />,
};

export const StarFilled: StoryObj = {
	render: () => <StarIcon size={24} filled />,
};

export const AllIcons: StoryObj = {
	render: () => (
		<div className="flex gap-4 items-center">
			<DogPawIcon size={32} />
			<WarningIcon size={32} />
			<InfoIcon size={32} />
			<StarIcon size={32} />
			<StarIcon size={32} filled />
		</div>
	),
};

export const DifferentSizes: StoryObj = {
	render: () => (
		<div className="flex gap-4 items-center">
			<DogPawIcon size={16} />
			<DogPawIcon size={24} />
			<DogPawIcon size={32} />
			<DogPawIcon size={48} />
		</div>
	),
};

export const DifferentColors: StoryObj = {
	render: () => (
		<div className="flex gap-4 items-center">
			<DogPawIcon size={32} color="var(--danger)" />
			<DogPawIcon size={32} color="var(--success)" />
			<DogPawIcon size={32} color="var(--accent)" />
			<DogPawIcon size={32} color="var(--warning)" />
		</div>
	),
};

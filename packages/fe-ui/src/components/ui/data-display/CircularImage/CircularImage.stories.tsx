import type { Meta, StoryObj } from "@storybook/react";
import { CircularImage } from "./CircularImage";

const meta: Meta<typeof CircularImage> = {
	title: "UI/CircularImage",
	component: CircularImage,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "이미지 크기 (sm: 40px, md: 56px, lg: 80px)",
		},
		src: {
			control: "text",
			description: "이미지 URL",
		},
		alt: {
			control: "text",
			description: "대체 텍스트",
		},
		className: {
			control: "text",
			description: "추가 CSS 클래스",
		},
	},
};

export default meta;
type Story = StoryObj<typeof CircularImage>;

export const Default: Story = {
	args: {
		src: "/moka.webp",
		alt: "프로필 이미지",
		size: "md",
	},
};

export const Small: Story = {
	args: {
		src: "/moka.webp",
		alt: "작은 프로필 이미지",
		size: "sm",
	},
};

export const Large: Story = {
	args: {
		src: "/moka.webp",
		alt: "큰 프로필 이미지",
		size: "lg",
	},
};

export const AllSizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<CircularImage src="/moka.webp" alt="Small" size="sm" />
			<CircularImage src="/moka.webp" alt="Medium" size="md" />
			<CircularImage src="/moka.webp" alt="Large" size="lg" />
		</div>
	),
};

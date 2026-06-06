import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta = {
	title: "Ui/data-display/Card",
	component: Card,
	tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "카드 내용",
	},
};

export const Variants: Story = {
	args: {
		children: null,
		variant: "secondary",
	},
	render: () => (
		<div className="space-y-4">
			<Card variant="secondary">
				<Card.Header>
					<Card.Title>Secondary</Card.Title>
				</Card.Header>
				<Card.Content>보조 카드 변형</Card.Content>
			</Card>
			<Card variant="tertiary">
				<Card.Header>
					<Card.Title>Tertiary</Card.Title>
				</Card.Header>
				<Card.Content>강조 카드 변형</Card.Content>
			</Card>
		</div>
	),
};

export const Composition: Story = {
	args: {
		children: "본문 영역 콘텐츠",
	},
	render: () => (
		<Card variant="tertiary">
			<Card.Header>
				<Card.Title>섹션 카드</Card.Title>
				<Card.Description>부제목을 함께 표시</Card.Description>
			</Card.Header>
			<Card.Content>본문 영역 콘텐츠</Card.Content>
			<Card.Footer className="text-sm">푸터 영역</Card.Footer>
		</Card>
	),
};

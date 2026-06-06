import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./Table";

const meta = {
	title: "Ui/data-display/Table",
	component: Table,
	tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Table aria-label="기본 테이블">
			<Table.Content>
				<Table.Header>
					<Table.Column key="name">이름</Table.Column>
					<Table.Column key="status">상태</Table.Column>
				</Table.Header>
				<Table.Body>
					<Table.Row key="1">
						<Table.Cell>홍길동</Table.Cell>
						<Table.Cell>활성</Table.Cell>
					</Table.Row>
					<Table.Row key="2">
						<Table.Cell>김개발</Table.Cell>
						<Table.Cell>대기</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Content>
		</Table>
	),
};

export const Variants: Story = {
	render: () => (
		<div className="space-y-4">
			<Table aria-label="secondary" variant="secondary">
				<Table.Content>
					<Table.Header>
						<Table.Column key="item">항목</Table.Column>
					</Table.Header>
					<Table.Body>
						<Table.Row key="1">
							<Table.Cell>변형</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Content>
			</Table>
			<Table aria-label="primary" variant="primary">
				<Table.Content>
					<Table.Header>
						<Table.Column key="item">항목</Table.Column>
					</Table.Header>
					<Table.Body>
						<Table.Row key="1">
							<Table.Cell>강조</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Content>
			</Table>
		</div>
	),
};

export const Composition: Story = {
	render: () => (
		<Table aria-label="컴포지션 테이블">
			<Table.Content>
				<Table.Header>
					<Table.Column key="item">항목</Table.Column>
					<Table.Column key="description">설명</Table.Column>
				</Table.Header>
				<Table.Body>
					<Table.Row key="1">
						<Table.Cell>Header</Table.Cell>
						<Table.Cell>컬럼/셀 조합</Table.Cell>
					</Table.Row>
				</Table.Body>
				<Table.Footer>
					<Table.Row key="footer">
						<Table.Cell colSpan={2}>Footer 영역</Table.Cell>
					</Table.Row>
				</Table.Footer>
			</Table.Content>
		</Table>
	),
};

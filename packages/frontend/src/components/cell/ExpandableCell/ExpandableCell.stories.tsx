import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ExpandableCell } from "./ExpandableCell";

const meta: Meta<typeof ExpandableCell> = {
	title: "Cell/ExpandableCell",
	component: ExpandableCell,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "text",
			description: "Text or number value to display",
		},
		expandable: {
			control: "boolean",
			description: "Whether the cell supports expansion",
		},
		depth: {
			control: "number",
			description: "Nesting depth level",
		},
		canExpand: {
			control: "boolean",
			description: "Whether the cell can be expanded",
		},
		isExpanded: {
			control: "boolean",
			description: "Whether the cell is currently expanded",
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

const ExpandableCellWithState = (props: any) => {
	const [isExpanded, setIsExpanded] = useState(props.isExpanded || false);

	return (
		<ExpandableCell
			{...props}
			isExpanded={isExpanded}
			onToggleExpand={() => setIsExpanded(!isExpanded)}
		/>
	);
};

export const Default: Story = {
	args: {
		value: "Folder name",
		expandable: true,
		depth: 0,
		canExpand: true,
		isExpanded: false,
	},
	render: ExpandableCellWithState,
};

export const Document: Story = {
	args: {
		value: "Document.pdf",
		expandable: true,
		depth: 0,
		canExpand: false,
		isExpanded: false,
	},
};

export const ExpandedFolder: Story = {
	args: {
		value: "Expanded folder",
		expandable: true,
		depth: 0,
		canExpand: true,
		isExpanded: true,
	},
	render: ExpandableCellWithState,
};

export const NestedLevel1: Story = {
	args: {
		value: "Subfolder",
		expandable: true,
		depth: 1,
		canExpand: true,
		isExpanded: false,
	},
	render: ExpandableCellWithState,
};

export const NestedLevel2: Story = {
	args: {
		value: "Deep folder",
		expandable: true,
		depth: 2,
		canExpand: true,
		isExpanded: false,
	},
	render: ExpandableCellWithState,
};

export const NestedDocument: Story = {
	args: {
		value: "nested-file.txt",
		expandable: true,
		depth: 2,
		canExpand: false,
		isExpanded: false,
	},
};

export const NonExpandable: Story = {
	args: {
		value: "Simple text",
		expandable: false,
		depth: 0,
		canExpand: false,
		isExpanded: false,
	},
};

export const TreeStructure: Story = {
	render: () => (
		<div className="space-y-1">
			<ExpandableCell
				value="Root folder"
				expandable={true}
				depth={0}
				canExpand={true}
				isExpanded={true}
				onToggleExpand={() => {}}
			/>
			<ExpandableCell
				value="Subfolder 1"
				expandable={true}
				depth={1}
				canExpand={true}
				isExpanded={false}
				onToggleExpand={() => {}}
			/>
			<ExpandableCell
				value="Document 1.pdf"
				expandable={true}
				depth={1}
				canExpand={false}
				isExpanded={false}
			/>
			<ExpandableCell
				value="Subfolder 2"
				expandable={true}
				depth={1}
				canExpand={true}
				isExpanded={true}
				onToggleExpand={() => {}}
			/>
			<ExpandableCell
				value="Deep file.txt"
				expandable={true}
				depth={2}
				canExpand={false}
				isExpanded={false}
			/>
		</div>
	),
};

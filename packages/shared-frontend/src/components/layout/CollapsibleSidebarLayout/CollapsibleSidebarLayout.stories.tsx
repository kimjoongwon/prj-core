import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CollapsibleSidebar } from "./CollapsibleSidebarLayout";
import { Button } from "../../ui/Button/Button";

const meta: Meta<typeof CollapsibleSidebar> = {
	title: "Layout/CollapsibleSidebar",
	component: CollapsibleSidebar,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story["render"] = (args) => {
	const [isCollapsed, setIsCollapsed] = useState(args.isCollapsed);

	return (
		<CollapsibleSidebar
			{...args}
			isCollapsed={isCollapsed}
			onToggle={() => setIsCollapsed(!isCollapsed)}
		>
			{isCollapsed ? (
				<>
					<Button isIconOnly>C1</Button>
					<Button isIconOnly>C2</Button>
				</>
			) : (
				<>
					<Button>Child 1</Button>
					<Button>Child 2</Button>
				</>
			)}
		</CollapsibleSidebar>
	);
};

export const Default: Story = {
	args: {
		isCollapsed: false,
		parentMenuInfo: {
			name: "Parent Menu",
			pathname: "/parent",
			icon: "Home",
		},
	},
	render: Template,
};

export const Collapsed: Story = {
	args: {
		isCollapsed: true,
		parentMenuInfo: {
			name: "Parent Menu",
			pathname: "/parent",
			icon: "Home",
		},
	},
	render: Template,
};

export const NoParentMenu: Story = {
	args: {
		isCollapsed: false,
	},
	render: Template,
};

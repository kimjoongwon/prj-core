import type { Meta, StoryObj } from "@storybook/react";
import { Disclosure } from "../Disclosure";
import { DisclosureGroup } from "./DisclosureGroup";

const meta: Meta<typeof DisclosureGroup> = {
	title: "Navigation/DisclosureGroup",
	component: DisclosureGroup,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const renderDisclosureGroup = (args: Story["args"]) => (
	<div className="w-full max-w-xl">
		<DisclosureGroup {...args}>
			<Disclosure id="general">
				<Disclosure.Heading>
					<Disclosure.Trigger className="justify-between">
						General
						<Disclosure.Indicator />
					</Disclosure.Trigger>
				</Disclosure.Heading>
				<Disclosure.Content>
					<Disclosure.Body>
						General navigation links and summaries.
					</Disclosure.Body>
				</Disclosure.Content>
			</Disclosure>
			<Disclosure id="advanced">
				<Disclosure.Heading>
					<Disclosure.Trigger className="justify-between">
						Advanced
						<Disclosure.Indicator />
					</Disclosure.Trigger>
				</Disclosure.Heading>
				<Disclosure.Content>
					<Disclosure.Body>
						Advanced settings and nested actions.
					</Disclosure.Body>
				</Disclosure.Content>
			</Disclosure>
		</DisclosureGroup>
	</div>
);

export const Default: Story = {
	args: {
		defaultExpandedKeys: ["general"],
	},
	render: renderDisclosureGroup,
};

export const States: Story = {
	args: {
		allowsMultipleExpanded: true,
		defaultExpandedKeys: ["general", "advanced"],
	},
	render: renderDisclosureGroup,
};

export const Composition: Story = {
	args: {
		defaultExpandedKeys: ["advanced"],
	},
	render: renderDisclosureGroup,
};

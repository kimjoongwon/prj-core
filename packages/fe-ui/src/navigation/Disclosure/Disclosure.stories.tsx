import type { Meta, StoryObj } from "@storybook/react";
import { Disclosure } from "./Disclosure";

const meta: Meta<typeof Disclosure> = {
	title: "Navigation/Disclosure",
	component: Disclosure,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const renderDisclosure = (args: Story["args"]) => (
	<div className="w-full max-w-xl">
		<Disclosure {...args}>
			<Disclosure.Heading>
				<Disclosure.Trigger className="justify-between">
					Quick Filters
					<Disclosure.Indicator />
				</Disclosure.Trigger>
			</Disclosure.Heading>
			<Disclosure.Content>
				<Disclosure.Body>
					Use disclosure when a single expandable region controls contextual
					navigation or filters.
				</Disclosure.Body>
			</Disclosure.Content>
		</Disclosure>
	</div>
);

export const Default: Story = {
	args: {
		defaultExpanded: true,
	},
	render: renderDisclosure,
};

export const Composition: Story = {
	args: {},
	render: renderDisclosure,
};

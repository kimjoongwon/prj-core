import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";

const meta: Meta<typeof Accordion> = {
	title: "Navigation/Accordion",
	component: Accordion,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const renderAccordion = (args: Story["args"]) => (
	<div className="w-full max-w-xl">
		<Accordion {...args}>
			<Accordion.Item id="overview">
				<Accordion.Heading>
					<Accordion.Trigger>Overview</Accordion.Trigger>
				</Accordion.Heading>
				<Accordion.Panel>
					<Accordion.Body>
						Navigation wrappers keep the HeroUI compound API intact.
					</Accordion.Body>
				</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item id="details">
				<Accordion.Heading>
					<Accordion.Trigger>Details</Accordion.Trigger>
				</Accordion.Heading>
				<Accordion.Panel>
					<Accordion.Body>
						Use the compound slots to control heading, trigger, and content.
					</Accordion.Body>
				</Accordion.Panel>
			</Accordion.Item>
		</Accordion>
	</div>
);

export const Default: Story = {
	args: {
		defaultExpandedKeys: ["overview"],
	},
	render: renderAccordion,
};

export const Variants: Story = {
	args: {
		defaultExpandedKeys: ["overview"],
		variant: "surface",
	},
	render: renderAccordion,
};

export const Composition: Story = {
	args: {
		defaultExpandedKeys: ["details"],
	},
	render: (args) => (
		<div className="w-full max-w-xl">
			<Accordion {...args}>
				<Accordion.Item id="spec">
					<Accordion.Heading>
						<Accordion.Trigger className="justify-between">
							Service Spec
							<Accordion.Indicator />
						</Accordion.Trigger>
					</Accordion.Heading>
					<Accordion.Panel>
						<Accordion.Body>
							Compound composition lets consumers place the indicator
							explicitly.
						</Accordion.Body>
					</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
		</div>
	),
};

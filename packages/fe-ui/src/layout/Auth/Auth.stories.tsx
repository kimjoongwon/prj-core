import type { Meta, StoryObj } from "@storybook/react";
import { Auth } from "./Auth";

const meta = {
	title: "layout/Auth",
	component: Auth,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
} satisfies Meta<typeof Auth>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Centered: Story = {
	render: () => (
		<Auth>
			<Auth.Body>
				<Auth.Main>
					<div className="rounded-2xl border border-border bg-surface p-6">
						Auth form area
					</div>
				</Auth.Main>
			</Auth.Body>
		</Auth>
	),
};

export const Split: Story = {
	render: () => (
		<Auth>
			<Auth.Body>
				<Auth.Aside>
					<div className="flex h-full items-center justify-center bg-surface-secondary p-10 text-xl font-semibold">
						Brand story
					</div>
				</Auth.Aside>
				<Auth.Main>
					<div className="rounded-2xl border border-border bg-surface p-6">
						Login panel
					</div>
				</Auth.Main>
			</Auth.Body>
		</Auth>
	),
};

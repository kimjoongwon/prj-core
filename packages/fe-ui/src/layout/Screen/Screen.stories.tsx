import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "../../data-display/Typography";
import { Button } from "../../input";
import { Screen } from "./Screen";

const meta = {
	title: "layout/Screen",
	component: Screen,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"Admin.Main 안에서 screen-level max-width와 vertical rhythm을 제공하는 compound boundary입니다.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Screen>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = {
	render: () => (
		<div className="min-h-screen bg-surface-secondary p-6 text-foreground">
			<Screen>
				<Screen.Header
					title="Screen"
					description="Screen.Header, Screen.Body, Screen.Footer 슬롯을 조합합니다."
					actions={<Button size="sm">Action</Button>}
				/>
				<Screen.Body>
					<div className="rounded-lg border border-border bg-surface p-5">
						<Typography>Screen body</Typography>
					</div>
				</Screen.Body>
				<Screen.Footer>
					<div className="rounded-lg border border-border bg-surface p-4">
						<Typography.Paragraph color="muted" size="sm">
							Screen footer
						</Typography.Paragraph>
					</div>
				</Screen.Footer>
			</Screen>
		</div>
	),
};

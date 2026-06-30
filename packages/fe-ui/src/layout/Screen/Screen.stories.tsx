import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../action";
import { PageTitleBar } from "../../widget/PageTitleBar";
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
				<Screen.Header>
					<PageTitleBar
						title="Screen"
						description="Screen.Header, Screen.Body, Screen.Footer 슬롯을 조합합니다."
						actions={<Button size="sm">Action</Button>}
					/>
				</Screen.Header>
				<Screen.Body>
					<div className="rounded-lg border border-border bg-surface p-5">
						Screen body
					</div>
				</Screen.Body>
				<Screen.Footer>
					<div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted">
						Screen footer
					</div>
				</Screen.Footer>
			</Screen>
		</div>
	),
};

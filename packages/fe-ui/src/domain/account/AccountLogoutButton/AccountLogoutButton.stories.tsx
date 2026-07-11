import { Dropdown } from "@heroui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { AccountLogoutButton } from "./AccountLogoutButton";

const meta = {
	title: "domain/account/AccountLogoutButton",
	component: AccountLogoutButton,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof AccountLogoutButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Dropdown>
			<Dropdown.Trigger>메뉴</Dropdown.Trigger>
			<Dropdown.Popover>
				<Dropdown.Menu aria-label="사용자 메뉴">
					<AccountLogoutButton />
				</Dropdown.Menu>
			</Dropdown.Popover>
		</Dropdown>
	),
};

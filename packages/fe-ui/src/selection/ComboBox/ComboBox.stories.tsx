import { Input, ListBox } from "@heroui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { ComboBox } from "./ComboBox";

const meta: Meta<typeof ComboBox> = {
	title: "selection/ComboBox",
	component: ComboBox,
	tags: ["autodocs"],
	argTypes: {
		children: {
			table: {
				disable: true,
			},
			control: false,
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		"aria-label": "도시 선택",
		defaultSelectedKey: "seoul",
	},
	render: (args) => (
		<ComboBox {...args}>
			<>
				<ComboBox.InputGroup>
					<Input placeholder="도시 검색" />
					<ComboBox.Trigger />
				</ComboBox.InputGroup>
				<ComboBox.Popover>
					<ListBox>
						<ListBox.Item id="seoul" textValue="서울">
							서울
						</ListBox.Item>
						<ListBox.Item id="busan" textValue="부산">
							부산
						</ListBox.Item>
						<ListBox.Item id="jeju" textValue="제주">
							제주
						</ListBox.Item>
					</ListBox>
				</ComboBox.Popover>
			</>
		</ComboBox>
	),
};

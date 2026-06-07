import type { Meta, StoryObj } from "@storybook/react";
import { Button, Label } from "@heroui/react";
import { InputGroup } from "../../input/InputGroup/InputGroup";
import { Form } from "./Form";

const meta: Meta<typeof Form> = {
	title: "form/Form",
	component: Form,
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
		className: "w-80 gap-3",
	},
	render: (args) => (
		<Form {...args}>
			<>
				<div className="flex flex-col gap-1">
					<Label>이메일</Label>
					<InputGroup>
						<InputGroup.Input placeholder="admin@example.com" />
					</InputGroup>
				</div>
				<Button size="sm" type="submit" variant="secondary">
					저장
				</Button>
			</>
		</Form>
	),
};

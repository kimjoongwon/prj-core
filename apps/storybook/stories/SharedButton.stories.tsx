import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@shared/frontend";

const meta = {
  title: "Shared/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
    },
    variant: {
      control: "select",
      options: ["solid", "bordered", "light", "flat", "faded", "shadow", "ghost"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
    },
    isDisabled: {
      control: "boolean",
    },
    isLoading: {
      control: "boolean",
    },
    fullWidth: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Primary: Story = {
  args: {
    children: "Primary Button",
    color: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    color: "secondary",
  },
};

export const Success: Story = {
  args: {
    children: "Success Button",
    color: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "Warning Button",
    color: "warning",
  },
};

export const Danger: Story = {
  args: {
    children: "Danger Button",
    color: "danger",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="solid" color="primary">
        Solid
      </Button>
      <Button variant="bordered" color="primary">
        Bordered
      </Button>
      <Button variant="light" color="primary">
        Light
      </Button>
      <Button variant="flat" color="primary">
        Flat
      </Button>
      <Button variant="faded" color="primary">
        Faded
      </Button>
      <Button variant="shadow" color="primary">
        Shadow
      </Button>
      <Button variant="ghost" color="primary">
        Ghost
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm" color="primary">
        Small
      </Button>
      <Button size="md" color="primary">
        Medium
      </Button>
      <Button size="lg" color="primary">
        Large
      </Button>
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button radius="none" color="primary">
        None
      </Button>
      <Button radius="sm" color="primary">
        Small
      </Button>
      <Button radius="md" color="primary">
        Medium
      </Button>
      <Button radius="lg" color="primary">
        Large
      </Button>
      <Button radius="full" color="primary">
        Full
      </Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button color="primary">Normal</Button>
      <Button color="primary" isDisabled>
        Disabled
      </Button>
      <Button color="primary" isLoading>
        Loading
      </Button>
    </div>
  ),
};

export const FullWidth: Story = {
  args: {
    children: "Full Width Button",
    color: "primary",
    fullWidth: true,
  },
  parameters: {
    layout: "padded",
  },
};

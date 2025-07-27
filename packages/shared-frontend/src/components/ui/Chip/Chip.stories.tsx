import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "./Chip";

const meta = {
  title: "UI/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A customizable chip component based on NextUI Chip with variant and color support.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "bordered", "light", "flat", "faded", "shadow", "dot"],
      description: "The visual style variant of the chip",
      defaultValue: "solid",
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
      description: "The color theme of the chip",
      defaultValue: "default",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the chip",
      defaultValue: "md",
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
      description: "The border radius of the chip",
      defaultValue: "full",
    },
    children: {
      control: "text",
      description: "The content to display inside the chip",
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Chip",
  },
  parameters: {
    docs: {
      description: {
        story: "Default chip with solid variant and default color.",
      },
    },
  },
};

export const Primary: Story = {
  args: {
    children: "Primary",
    color: "primary",
  },
  parameters: {
    docs: {
      description: {
        story: "Primary chip with primary color theme.",
      },
    },
  },
};

export const Success: Story = {
  args: {
    children: "Success",
    color: "success",
  },
  parameters: {
    docs: {
      description: {
        story: "Success chip for positive states.",
      },
    },
  },
};

export const Warning: Story = {
  args: {
    children: "Warning",
    color: "warning",
  },
  parameters: {
    docs: {
      description: {
        story: "Warning chip for caution states.",
      },
    },
  },
};

export const Danger: Story = {
  args: {
    children: "Error",
    color: "danger",
  },
  parameters: {
    docs: {
      description: {
        story: "Danger chip for error states.",
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Chip variant="solid" color="primary">
        Solid
      </Chip>
      <Chip variant="bordered" color="primary">
        Bordered
      </Chip>
      <Chip variant="light" color="primary">
        Light
      </Chip>
      <Chip variant="flat" color="primary">
        Flat
      </Chip>
      <Chip variant="faded" color="primary">
        Faded
      </Chip>
      <Chip variant="shadow" color="primary">
        Shadow
      </Chip>
      <Chip variant="dot" color="primary">
        Dot
      </Chip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available chip variants with primary color.",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Chip size="sm" color="primary">
        Small
      </Chip>
      <Chip size="md" color="primary">
        Medium
      </Chip>
      <Chip size="lg" color="primary">
        Large
      </Chip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different chip sizes: small, medium, and large.",
      },
    },
  },
};

export const Colors: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Chip color="default">Default</Chip>
      <Chip color="primary">Primary</Chip>
      <Chip color="secondary">Secondary</Chip>
      <Chip color="success">Success</Chip>
      <Chip color="warning">Warning</Chip>
      <Chip color="danger">Danger</Chip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available chip colors.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: "Playground Chip",
    color: "primary",
    variant: "solid",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different chip configurations.",
      },
    },
  },
};

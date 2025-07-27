import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A customizable button component based on NextUI Button with observer pattern support.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "bordered", "light", "flat", "faded", "shadow", "ghost"],
      description: "The visual style variant of the button",
      defaultValue: "solid",
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
      description: "The color theme of the button",
      defaultValue: "default",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the button",
      defaultValue: "md",
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
      description: "The border radius of the button",
      defaultValue: "md",
    },
    isDisabled: {
      control: "boolean",
      description: "Whether the button is disabled",
      defaultValue: false,
    },
    isLoading: {
      control: "boolean",
      description: "Whether the button is in loading state",
      defaultValue: false,
    },
    fullWidth: {
      control: "boolean",
      description: "Whether the button should take full width",
      defaultValue: false,
    },
    isIconOnly: {
      control: "boolean",
      description: "Whether the button contains only an icon",
      defaultValue: false,
    },
    children: {
      control: "text",
      description: "The content to display inside the button",
    },
    onPress: {
      description: "Callback function called when button is pressed",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
    onPress: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Default button with solid variant and default color.",
      },
    },
  },
};

export const Primary: Story = {
  args: {
    children: "Primary Button",
    color: "primary",
    onPress: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Primary button with primary color theme.",
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    color: "secondary",
    variant: "bordered",
    onPress: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Secondary button with bordered variant.",
      },
    },
  },
};

export const Danger: Story = {
  args: {
    children: "Delete",
    color: "danger",
    onPress: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Danger button for destructive actions.",
      },
    },
  },
};

export const Success: Story = {
  args: {
    children: "Save",
    color: "success",
    onPress: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Success button for positive actions.",
      },
    },
  },
};

export const Loading: Story = {
  args: {
    children: "Loading...",
    isLoading: true,
    color: "primary",
    onPress: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Button in loading state with spinner.",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    isDisabled: true,
    onPress: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Disabled button that cannot be interacted with.",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button size="sm" onPress={() => {}}>
        Small
      </Button>
      <Button size="md" onPress={() => {}}>
        Medium
      </Button>
      <Button size="lg" onPress={() => {}}>
        Large
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different button sizes: small, medium, and large.",
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Button variant="solid" color="primary" onPress={() => {}}>
        Solid
      </Button>
      <Button variant="bordered" color="primary" onPress={() => {}}>
        Bordered
      </Button>
      <Button variant="light" color="primary" onPress={() => {}}>
        Light
      </Button>
      <Button variant="flat" color="primary" onPress={() => {}}>
        Flat
      </Button>
      <Button variant="faded" color="primary" onPress={() => {}}>
        Faded
      </Button>
      <Button variant="shadow" color="primary" onPress={() => {}}>
        Shadow
      </Button>
      <Button variant="ghost" color="primary" onPress={() => {}}>
        Ghost
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available button variants with primary color.",
      },
    },
  },
};

export const Colors: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Button color="default" onPress={() => {}}>
        Default
      </Button>
      <Button color="primary" onPress={() => {}}>
        Primary
      </Button>
      <Button color="secondary" onPress={() => {}}>
        Secondary
      </Button>
      <Button color="success" onPress={() => {}}>
        Success
      </Button>
      <Button color="warning" onPress={() => {}}>
        Warning
      </Button>
      <Button color="danger" onPress={() => {}}>
        Danger
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available button colors.",
      },
    },
  },
};

export const FullWidth: Story = {
  args: {
    children: "Full Width Button",
    fullWidth: true,
    color: "primary",
    onPress: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Button that takes the full width of its container.",
      },
    },
  },
};

export const IconOnly: Story = {
  args: {
    children: "❤️",
    isIconOnly: true,
    color: "danger",
    variant: "light",
    onPress: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Icon-only button with no text content.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: "Playground Button",
    color: "primary",
    variant: "solid",
    size: "md",
    onPress: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different button configurations.",
      },
    },
  },
};

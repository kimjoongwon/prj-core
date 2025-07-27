import type { Meta, StoryObj } from "@storybook/react";
import { DarkModeSwitch } from "./DarkModeSwitch";

const meta = {
  title: "UI/DarkModeSwitch",
  component: DarkModeSwitch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A toggle switch component that allows users to switch between light and dark modes. Can be positioned in any corner of the screen or inline.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["top-left", "top-right", "bottom-left", "bottom-right", "inline"],
      description: "Position of the dark mode switch",
      defaultValue: "bottom-right",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the switch icon",
      defaultValue: "md",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
  },
} satisfies Meta<typeof DarkModeSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Default dark mode switch positioned at bottom-right with medium size.",
      },
    },
  },
};

export const Inline: Story = {
  args: {
    position: "inline",
  },
  parameters: {
    docs: {
      description: {
        story: "Dark mode switch positioned inline for use within other components.",
      },
    },
  },
};

export const Sizes: Story = {
  args: {},
  render: () => (
    <div className="flex gap-4 items-center">
      <DarkModeSwitch position="inline" size="sm" />
      <DarkModeSwitch position="inline" size="md" />
      <DarkModeSwitch position="inline" size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different sizes of the dark mode switch: small, medium, and large.",
      },
    },
  },
};

export const Positions: Story = {
  args: {},
  render: () => (
    <div className="relative w-96 h-64 border border-gray-300 rounded bg-gray-50">
      <DarkModeSwitch position="top-left" />
      <DarkModeSwitch position="top-right" />
      <DarkModeSwitch position="bottom-left" />
      <DarkModeSwitch position="bottom-right" />
      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
        Preview Area
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available positions for the dark mode switch in corners of the screen.",
      },
    },
  },
};

export const WithCustomStyling: Story = {
  args: {
    position: "inline",
    className: "bg-blue-100 hover:bg-blue-200 border border-blue-300",
  },
  parameters: {
    docs: {
      description: {
        story: "Dark mode switch with custom styling applied.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    position: "inline",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different dark mode switch configurations.",
      },
    },
  },
};
import type { Meta, StoryObj } from "@storybook/react";
import { HStack } from "./HStack";

const meta = {
  title: "UI/HStack",
  component: HStack,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A horizontal stack component that arranges children in a row with customizable alignment, spacing, and layout options.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    alignItems: {
      control: "select",
      options: ["start", "center", "end", "stretch", "baseline"],
      description: "Vertical alignment of items",
    },
    justifyContent: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
      description: "Horizontal distribution of items",
    },
    gap: {
      control: "select",
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
      description: "Gap between items in pixels (Tailwind spacing units)",
      defaultValue: 4,
    },
    fullWidth: {
      control: "boolean",
      description: "Whether the stack should take full width",
      defaultValue: false,
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
  },
} satisfies Meta<typeof HStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleItem = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-2 bg-blue-200 rounded border ${className}`}>{children}</div>;

export const Default: Story = {
  render: () => (
    <HStack>
      <SampleItem>Item 1</SampleItem>
      <SampleItem>Item 2</SampleItem>
      <SampleItem>Item 3</SampleItem>
    </HStack>
  ),
  parameters: {
    docs: {
      description: {
        story: "Default horizontal stack with standard gap and alignment.",
      },
    },
  },
};

export const AlignItems: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold mb-2">Align Start</h4>
        <HStack alignItems="start" className="border border-gray-300 p-2 h-20">
          <SampleItem className="h-8">Short</SampleItem>
          <SampleItem className="h-12">Medium</SampleItem>
          <SampleItem className="h-16">Tall</SampleItem>
        </HStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Align Center</h4>
        <HStack alignItems="center" className="border border-gray-300 p-2 h-20">
          <SampleItem className="h-8">Short</SampleItem>
          <SampleItem className="h-12">Medium</SampleItem>
          <SampleItem className="h-16">Tall</SampleItem>
        </HStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Align End</h4>
        <HStack alignItems="end" className="border border-gray-300 p-2 h-20">
          <SampleItem className="h-8">Short</SampleItem>
          <SampleItem className="h-12">Medium</SampleItem>
          <SampleItem className="h-16">Tall</SampleItem>
        </HStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Align Stretch</h4>
        <HStack alignItems="stretch" className="border border-gray-300 p-2 h-20">
          <SampleItem>Short</SampleItem>
          <SampleItem>Medium</SampleItem>
          <SampleItem>Tall</SampleItem>
        </HStack>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different vertical alignment options for items.",
      },
    },
  },
};

export const JustifyContent: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <div>
        <h4 className="text-sm font-semibold mb-2">Justify Start</h4>
        <HStack justifyContent="start" fullWidth className="border border-gray-300 p-2">
          <SampleItem>A</SampleItem>
          <SampleItem>B</SampleItem>
          <SampleItem>C</SampleItem>
        </HStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Justify Center</h4>
        <HStack justifyContent="center" fullWidth className="border border-gray-300 p-2">
          <SampleItem>A</SampleItem>
          <SampleItem>B</SampleItem>
          <SampleItem>C</SampleItem>
        </HStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Justify End</h4>
        <HStack justifyContent="end" fullWidth className="border border-gray-300 p-2">
          <SampleItem>A</SampleItem>
          <SampleItem>B</SampleItem>
          <SampleItem>C</SampleItem>
        </HStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Justify Between</h4>
        <HStack justifyContent="between" fullWidth className="border border-gray-300 p-2">
          <SampleItem>A</SampleItem>
          <SampleItem>B</SampleItem>
          <SampleItem>C</SampleItem>
        </HStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Justify Around</h4>
        <HStack justifyContent="around" fullWidth className="border border-gray-300 p-2">
          <SampleItem>A</SampleItem>
          <SampleItem>B</SampleItem>
          <SampleItem>C</SampleItem>
        </HStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Justify Evenly</h4>
        <HStack justifyContent="evenly" fullWidth className="border border-gray-300 p-2">
          <SampleItem>A</SampleItem>
          <SampleItem>B</SampleItem>
          <SampleItem>C</SampleItem>
        </HStack>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different horizontal distribution options for items.",
      },
    },
  },
};

export const GapSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold mb-2">No Gap (0px)</h4>
        <HStack gap={0} className="border border-gray-300 p-2">
          <SampleItem>Item 1</SampleItem>
          <SampleItem>Item 2</SampleItem>
          <SampleItem>Item 3</SampleItem>
        </HStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Small Gap (8px)</h4>
        <HStack gap={2} className="border border-gray-300 p-2">
          <SampleItem>Item 1</SampleItem>
          <SampleItem>Item 2</SampleItem>
          <SampleItem>Item 3</SampleItem>
        </HStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Medium Gap (16px)</h4>
        <HStack gap={4} className="border border-gray-300 p-2">
          <SampleItem>Item 1</SampleItem>
          <SampleItem>Item 2</SampleItem>
          <SampleItem>Item 3</SampleItem>
        </HStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Large Gap (32px)</h4>
        <HStack gap={8} className="border border-gray-300 p-2">
          <SampleItem>Item 1</SampleItem>
          <SampleItem>Item 2</SampleItem>
          <SampleItem>Item 3</SampleItem>
        </HStack>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different gap sizes between items in pixels (using Tailwind spacing units).",
      },
    },
  },
};

export const NavigationExample: Story = {
  render: () => (
    <HStack
      justifyContent="between"
      alignItems="center"
      fullWidth
      className="p-4 bg-white border-b"
    >
      <HStack gap={6}>
        <div className="text-xl font-bold text-blue-600">Logo</div>
        <HStack gap={4}>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            About
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Services
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Contact
          </a>
        </HStack>
      </HStack>
      <HStack gap={2}>
        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
          Sign In
        </button>
        <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          Sign Up
        </button>
      </HStack>
    </HStack>
  ),
  parameters: {
    docs: {
      description: {
        story: "Example navigation layout using HStack for responsive header design.",
      },
    },
  },
};

export const CardActionsExample: Story = {
  render: () => (
    <div className="max-w-sm bg-white border rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Product Card</h3>
      <p className="text-gray-600 mb-4">
        This is a sample product description that shows how HStack can be used for action buttons.
      </p>
      <HStack justifyContent="end" gap={2}>
        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
          Cancel
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add to Cart
        </button>
      </HStack>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Example card layout with action buttons using HStack.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    gap: 4,
    alignItems: "center",
    justifyContent: "start",
    fullWidth: false,
  },
  render: (args) => (
    <HStack {...args} className="border border-gray-300 p-4">
      <SampleItem>Item 1</SampleItem>
      <SampleItem>Item 2</SampleItem>
      <SampleItem>Item 3</SampleItem>
    </HStack>
  ),
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different HStack configurations.",
      },
    },
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { VStack } from "./VStack";

const meta = {
  title: "UI/VStack",
  component: VStack,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A vertical stack component that arranges children in a column with customizable alignment, spacing, and layout options.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    alignItems: {
      control: "select",
      options: ["start", "center", "end", "stretch", "baseline"],
      description: "Horizontal alignment of items",
    },
    justifyContent: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
      description: "Vertical distribution of items",
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
} satisfies Meta<typeof VStack>;

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
  args: {
    children: (
      <>
        <SampleItem>Item 1</SampleItem>
        <SampleItem>Item 2</SampleItem>
        <SampleItem>Item 3</SampleItem>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Default vertical stack with standard gap and alignment.",
      },
    },
  },
};

export const AlignItems: Story = {
  args: {},
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <div>
        <h4 className="text-sm font-semibold mb-2">Align Start</h4>
        <VStack alignItems="start" className="border border-gray-300 p-2 w-full">
          <SampleItem className="w-16">Short</SampleItem>
          <SampleItem className="w-24">Medium</SampleItem>
          <SampleItem className="w-32">Long Content</SampleItem>
        </VStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Align Center</h4>
        <VStack alignItems="center" className="border border-gray-300 p-2 w-full">
          <SampleItem className="w-16">Short</SampleItem>
          <SampleItem className="w-24">Medium</SampleItem>
          <SampleItem className="w-32">Long Content</SampleItem>
        </VStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Align End</h4>
        <VStack alignItems="end" className="border border-gray-300 p-2 w-full">
          <SampleItem className="w-16">Short</SampleItem>
          <SampleItem className="w-24">Medium</SampleItem>
          <SampleItem className="w-32">Long Content</SampleItem>
        </VStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Align Stretch</h4>
        <VStack alignItems="stretch" className="border border-gray-300 p-2 w-full">
          <SampleItem>Short</SampleItem>
          <SampleItem>Medium</SampleItem>
          <SampleItem>Long Content</SampleItem>
        </VStack>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different horizontal alignment options for items.",
      },
    },
  },
};

export const JustifyContent: Story = {
  args: {},
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold mb-2">Justify Start</h4>
        <VStack justifyContent="start" className="border border-gray-300 p-2 h-40">
          <SampleItem>A</SampleItem>
          <SampleItem>B</SampleItem>
          <SampleItem>C</SampleItem>
        </VStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Justify Center</h4>
        <VStack justifyContent="center" className="border border-gray-300 p-2 h-40">
          <SampleItem>A</SampleItem>
          <SampleItem>B</SampleItem>
          <SampleItem>C</SampleItem>
        </VStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Justify End</h4>
        <VStack justifyContent="end" className="border border-gray-300 p-2 h-40">
          <SampleItem>A</SampleItem>
          <SampleItem>B</SampleItem>
          <SampleItem>C</SampleItem>
        </VStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Justify Between</h4>
        <VStack justifyContent="between" className="border border-gray-300 p-2 h-40">
          <SampleItem>A</SampleItem>
          <SampleItem>B</SampleItem>
          <SampleItem>C</SampleItem>
        </VStack>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different vertical distribution options for items.",
      },
    },
  },
};

export const GapSizes: Story = {
  args: {},
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold mb-2">No Gap (0px)</h4>
        <VStack gap={0} className="border border-gray-300 p-2">
          <SampleItem>Item 1</SampleItem>
          <SampleItem>Item 2</SampleItem>
          <SampleItem>Item 3</SampleItem>
        </VStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Small Gap (8px)</h4>
        <VStack gap={2} className="border border-gray-300 p-2">
          <SampleItem>Item 1</SampleItem>
          <SampleItem>Item 2</SampleItem>
          <SampleItem>Item 3</SampleItem>
        </VStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Medium Gap (16px)</h4>
        <VStack gap={4} className="border border-gray-300 p-2">
          <SampleItem>Item 1</SampleItem>
          <SampleItem>Item 2</SampleItem>
          <SampleItem>Item 3</SampleItem>
        </VStack>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Large Gap (32px)</h4>
        <VStack gap={8} className="border border-gray-300 p-2">
          <SampleItem>Item 1</SampleItem>
          <SampleItem>Item 2</SampleItem>
          <SampleItem>Item 3</SampleItem>
        </VStack>
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

export const FormLayoutExample: Story = {
  args: {},
  render: () => (
    <VStack
      gap={4}
      alignItems="stretch"
      className="max-w-sm mx-auto p-6 bg-white border rounded-lg shadow"
    >
      <h3 className="text-lg font-semibold text-center">Contact Form</h3>

      <VStack gap={2} alignItems="stretch">
        <label className="text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </VStack>

      <VStack gap={2} alignItems="stretch">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </VStack>

      <VStack gap={2} alignItems="stretch">
        <label className="text-sm font-medium text-gray-700">Message</label>
        <textarea
          placeholder="Enter your message"
          rows={4}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </VStack>

      <button className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Send Message
      </button>
    </VStack>
  ),
  parameters: {
    docs: {
      description: {
        story: "Example form layout using VStack for organized vertical structure.",
      },
    },
  },
};

export const CardExample: Story = {
  args: {},
  render: () => (
    <VStack gap={4} className="max-w-sm bg-white border rounded-lg shadow overflow-hidden">
      <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>

      <VStack gap={3} className="px-6 pb-6">
        <VStack gap={1} alignItems="center">
          <h3 className="text-xl font-bold text-gray-900">Product Title</h3>
          <p className="text-2xl font-bold text-blue-600">$99.99</p>
        </VStack>

        <p className="text-gray-600 text-center">
          This is a sample product description that demonstrates how VStack can be used for card
          layouts.
        </p>

        <VStack gap={2} alignItems="stretch">
          <button className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add to Cart
          </button>
          <button className="w-full py-2 px-4 border border-gray-300 rounded hover:bg-gray-50">
            Add to Wishlist
          </button>
        </VStack>
      </VStack>
    </VStack>
  ),
  parameters: {
    docs: {
      description: {
        story: "Example product card layout using VStack for vertical organization.",
      },
    },
  },
};

export const NavigationSidebarExample: Story = {
  args: {},
  render: () => (
    <VStack gap={2} alignItems="stretch" className="w-48 p-4 bg-gray-50 border-r h-64">
      <h4 className="font-semibold text-gray-900 mb-2">Navigation</h4>

      <a href="#" className="px-3 py-2 text-gray-700 hover:bg-blue-100 rounded">
        Dashboard
      </a>
      <a href="#" className="px-3 py-2 text-gray-700 hover:bg-blue-100 rounded">
        Projects
      </a>
      <a href="#" className="px-3 py-2 text-gray-700 hover:bg-blue-100 rounded">
        Team
      </a>
      <a href="#" className="px-3 py-2 text-gray-700 hover:bg-blue-100 rounded">
        Settings
      </a>

      <div className="mt-auto pt-4 border-t">
        <a href="#" className="px-3 py-2 text-gray-700 hover:bg-red-100 rounded">
          Logout
        </a>
      </div>
    </VStack>
  ),
  parameters: {
    docs: {
      description: {
        story: "Example sidebar navigation using VStack for menu organization.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: (
      <>
        <SampleItem>Item 1</SampleItem>
        <SampleItem>Item 2</SampleItem>
        <SampleItem>Item 3</SampleItem>
      </>
    ),
    gap: 4,
    alignItems: "stretch",
    justifyContent: "start",
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different VStack configurations.",
      },
    },
  },
};
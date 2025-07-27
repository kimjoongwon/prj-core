import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./Logo";

const meta = {
  title: "UI/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A logo component that displays the application branding. Can be used as text or icon variant with optional click handling.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variants: {
      control: "select",
      options: ["text", "icon"],
      description: "The visual style variant of the logo",
      defaultValue: "text",
    },
    onClick: {
      description: "Callback function called when logo is clicked",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
    children: {
      control: "text",
      description: "Optional children content",
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variants: "text",
  },
  parameters: {
    docs: {
      description: {
        story: "Default logo with text variant.",
      },
    },
  },
};

export const TextVariant: Story = {
  args: {
    variants: "text",
    onClick: () => console.log("Logo clicked"),
  },
  parameters: {
    docs: {
      description: {
        story: "Text variant of the logo with click handler.",
      },
    },
  },
};

export const IconVariant: Story = {
  args: {
    variants: "icon",
    onClick: () => console.log("Logo clicked"),
  },
  parameters: {
    docs: {
      description: {
        story: "Icon variant of the logo (currently renders same as text).",
      },
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    variants: "text",
    className: "text-blue-600 hover:text-blue-800",
    onClick: () => console.log("Styled logo clicked"),
  },
  parameters: {
    docs: {
      description: {
        story: "Logo with custom styling classes.",
      },
    },
  },
};

export const InNavigationBar: Story = {
  render: () => (
    <div className="flex items-center justify-between w-full max-w-4xl p-4 bg-white border-b shadow-sm">
      <Logo variants="text" onClick={() => console.log("Navigate to home")} />
      <nav className="flex space-x-6">
        <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
        <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
        <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
      </nav>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Sign In
      </button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Logo used in a navigation bar layout.",
      },
    },
  },
};

export const InSidebar: Story = {
  render: () => (
    <div className="w-64 h-96 bg-gray-50 border-r p-4">
      <div className="mb-8">
        <Logo variants="text" className="text-xl" onClick={() => console.log("Sidebar logo clicked")} />
      </div>
      <nav className="space-y-2">
        <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-blue-100 rounded">
          Dashboard
        </a>
        <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-blue-100 rounded">
          Projects
        </a>
        <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-blue-100 rounded">
          Settings
        </a>
      </nav>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Logo used in a sidebar navigation layout.",
      },
    },
  },
};

export const WithDifferentSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Small:</span>
        <Logo variants="text" className="text-sm" />
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Medium:</span>
        <Logo variants="text" className="text-lg" />
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Large:</span>
        <Logo variants="text" className="text-3xl" />
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Extra Large:</span>
        <Logo variants="text" className="text-5xl" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Logo displayed in different sizes using className.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    variants: "text",
    className: "",
    onClick: () => alert("Logo clicked!"),
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different logo configurations.",
      },
    },
  },
};
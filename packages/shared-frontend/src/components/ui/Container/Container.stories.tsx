import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "./Container";

const meta = {
  title: "UI/Container",
  component: Container,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible container component that provides consistent layout structure with flex column by default.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
    children: {
      control: "text",
      description: "The content to display inside the container",
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Container content",
  },
  parameters: {
    docs: {
      description: {
        story: "Default container with flex column layout.",
      },
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    children: "Container with custom styling",
    className: "p-4 bg-blue-100 rounded-lg border-2 border-blue-300",
  },
  parameters: {
    docs: {
      description: {
        story: "Container with additional CSS classes for styling.",
      },
    },
  },
};

export const WithMultipleChildren: Story = {
  args: {
    className: "gap-4 p-4 bg-gray-50 rounded-lg",
    children: (
      <>
        <div className="p-2 bg-blue-200 rounded">Item 1</div>
        <div className="p-2 bg-green-200 rounded">Item 2</div>
        <div className="p-2 bg-yellow-200 rounded">Item 3</div>
      </>
    ),
  },
  render: (args) => <Container {...args} />,
  parameters: {
    docs: {
      description: {
        story: "Container with multiple child elements demonstrating flex column layout.",
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  args: {
    className: "w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg",
    children: (
      <>
        <h2 className="text-xl font-bold mb-4">Card Title</h2>
        <p className="text-gray-600 mb-4">
          This is an example of a responsive container that works well on different screen sizes.
        </p>
        <button className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
          Action Button
        </button>
      </>
    ),
  },
  render: (args) => <Container {...args} />,
  parameters: {
    docs: {
      description: {
        story: "Container used for responsive card-like layouts.",
      },
    },
  },
};

export const FormLayout: Story = {
  args: {
    className: "gap-4 p-6 max-w-sm bg-white border rounded-lg shadow",
    children: (
      <>
        <h3 className="text-lg font-semibold">Contact Form</h3>
        <input 
          type="text" 
          placeholder="Name" 
          className="w-full p-2 border rounded"
        />
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 border rounded"
        />
        <textarea 
          placeholder="Message" 
          rows={3}
          className="w-full p-2 border rounded resize-none"
        />
        <button className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600">
          Send Message
        </button>
      </>
    ),
  },
  render: (args) => <Container {...args} />,
  parameters: {
    docs: {
      description: {
        story: "Container used for form layouts with proper spacing.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: "Playground Container",
    className: "p-4 border-2 border-dashed border-gray-300",
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different container configurations.",
      },
    },
  },
};
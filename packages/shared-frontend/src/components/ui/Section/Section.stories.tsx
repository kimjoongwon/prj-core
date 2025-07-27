import type { Meta, StoryObj } from "@storybook/react";
import { Section } from "./Section";

const meta = {
  title: "UI/Section",
  component: Section,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A section container component that provides consistent layout structure with border, padding, and spacing for content areas.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "The content to display inside the section",
    },
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Section content",
  },
  parameters: {
    docs: {
      description: {
        story: "Default section with border and padding.",
      },
    },
  },
};

export const WithText: Story = {
  render: () => (
    <Section>
      <h2 className="text-xl font-bold">Section Title</h2>
      <p className="text-gray-600">
        This is a section with some text content. The section provides consistent 
        styling with border, padding, and spacing for organized layout.
      </p>
    </Section>
  ),
  parameters: {
    docs: {
      description: {
        story: "Section with heading and paragraph content.",
      },
    },
  },
};

export const WithForm: Story = {
  render: () => (
    <Section>
      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" 
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input 
            type="email" 
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" 
            placeholder="Enter your email"
          />
        </div>
        <button className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit
        </button>
      </div>
    </Section>
  ),
  parameters: {
    docs: {
      description: {
        story: "Section containing a form with proper spacing and layout.",
      },
    },
  },
};

export const WithStats: Story = {
  render: () => (
    <Section>
      <h3 className="text-lg font-semibold mb-4">Dashboard Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded">
          <div className="text-2xl font-bold text-blue-600">1,234</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded">
          <div className="text-2xl font-bold text-green-600">567</div>
          <div className="text-sm text-gray-600">Active Projects</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded">
          <div className="text-2xl font-bold text-yellow-600">89</div>
          <div className="text-sm text-gray-600">Pending Tasks</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded">
          <div className="text-2xl font-bold text-purple-600">12</div>
          <div className="text-sm text-gray-600">Team Members</div>
        </div>
      </div>
    </Section>
  ),
  parameters: {
    docs: {
      description: {
        story: "Section displaying statistics in a grid layout.",
      },
    },
  },
};

export const WithList: Story = {
  render: () => (
    <Section>
      <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
      <div className="space-y-3">
        {[
          { action: "User registered", time: "2 minutes ago", status: "success" },
          { action: "New project created", time: "5 minutes ago", status: "info" },
          { action: "Task completed", time: "10 minutes ago", status: "success" },
          { action: "Error in deployment", time: "15 minutes ago", status: "error" },
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                item.status === 'success' ? 'bg-green-500' :
                item.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`} />
              <span className="text-sm">{item.action}</span>
            </div>
            <span className="text-xs text-gray-500">{item.time}</span>
          </div>
        ))}
      </div>
    </Section>
  ),
  parameters: {
    docs: {
      description: {
        story: "Section with a list of activities or notifications.",
      },
    },
  },
};

export const NestedSections: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Section>
        <h2 className="text-xl font-bold mb-4">Main Section</h2>
        <p className="text-gray-600 mb-4">
          This is the main section containing nested subsections.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Section>
            <h4 className="font-semibold mb-2">Subsection A</h4>
            <p className="text-sm text-gray-600">
              Content for the first subsection with its own styling.
            </p>
          </Section>
          
          <Section>
            <h4 className="font-semibold mb-2">Subsection B</h4>
            <p className="text-sm text-gray-600">
              Content for the second subsection demonstrating layout flexibility.
            </p>
          </Section>
        </div>
      </Section>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Nested sections demonstrating hierarchical content organization.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: "Playground section content",
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different section configurations.",
      },
    },
  },
};
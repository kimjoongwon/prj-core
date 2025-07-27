import type { Meta, StoryObj } from "@storybook/react";
import { List } from "./List";

const meta = {
  title: "UI/List",
  component: List,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible list component that renders items from an array with a custom render function. Shows placeholder when empty.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      description: "Array of data items to render",
    },
    renderItem: {
      description: "Function to render each item",
    },
    placeholder: {
      description: "Content to show when the list is empty",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const sampleItems = [
  { id: 1, name: "Apple", type: "fruit", color: "red" },
  { id: 2, name: "Banana", type: "fruit", color: "yellow" },
  { id: 3, name: "Carrot", type: "vegetable", color: "orange" },
  { id: 4, name: "Broccoli", type: "vegetable", color: "green" },
];

const sampleUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor" },
];

export const Default: Story = {
  args: {
    data: sampleItems,
    renderItem: (item) => (
      <div key={item.id} className="p-2 border rounded mb-2">
        <span className="font-medium">{item.name}</span> - {item.type} ({item.color})
      </div>
    ),
    placeholder: <div className="text-gray-500 italic">No items to display</div>,
  },
  parameters: {
    docs: {
      description: {
        story: "Default list with simple item rendering.",
      },
    },
  },
};

export const UserList: Story = {
  args: {
    data: sampleUsers,
    renderItem: (user) => (
      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
        <div>
          <div className="font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
          {user.role}
        </span>
      </div>
    ),
    placeholder: <div className="text-center text-gray-500 py-8">No users found</div>,
  },
  parameters: {
    docs: {
      description: {
        story: "List displaying user information with styled cards.",
      },
    },
  },
};

export const EmptyList: Story = {
  args: {
    data: [],
    renderItem: (item: any) => (
      <div key={item.id} className="p-2 border rounded">
        {item.name}
      </div>
    ),
    placeholder: (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📭</div>
        <div className="text-lg font-medium text-gray-600">No items yet</div>
        <div className="text-sm text-gray-500 mt-1">Add some items to get started</div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Empty list showing custom placeholder content.",
      },
    },
  },
};

export const SimpleTextList: Story = {
  args: {
    data: ["First item", "Second item", "Third item", "Fourth item"],
    renderItem: (item, index) => (
      <div key={index} className="px-3 py-2 hover:bg-gray-100 border-b border-gray-200 last:border-b-0">
        {item}
      </div>
    ),
    placeholder: <div className="text-gray-500 p-4">No items available</div>,
  },
  parameters: {
    docs: {
      description: {
        story: "Simple text list with hover effects.",
      },
    },
  },
};

export const CardList: Story = {
  args: {
    data: [
      { id: 1, title: "Task 1", description: "Complete the project documentation", status: "pending" },
      { id: 2, title: "Task 2", description: "Review code changes", status: "completed" },
      { id: 3, title: "Task 3", description: "Update test cases", status: "in-progress" },
    ],
    renderItem: (task) => (
      <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">{task.title}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            task.status === 'completed' ? 'bg-green-100 text-green-800' :
            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {task.status}
          </span>
        </div>
        <p className="text-sm text-gray-600">{task.description}</p>
      </div>
    ),
    placeholder: (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="text-gray-400 text-2xl mb-2">📋</div>
        <div className="text-gray-600">No tasks available</div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Card-style list with status indicators and detailed placeholder.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    data: sampleItems,
    renderItem: (item) => (
      <div key={item.id} className="p-3 border rounded-lg mb-2 bg-white shadow-sm">
        <div className="font-medium">{item.name}</div>
        <div className="text-sm text-gray-500">{item.type} • {item.color}</div>
      </div>
    ),
    placeholder: <div className="text-gray-500 text-center py-4">No items to show</div>,
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different list configurations.",
      },
    },
  },
};
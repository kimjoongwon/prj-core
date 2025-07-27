import type { Meta, StoryObj } from "@storybook/react";
import { User } from "./User";

const meta = {
  title: "UI/User",
  component: User,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A user profile component with dropdown menu functionality. Displays user avatar and provides access to profile actions like settings and logout.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // Note: This component doesn't accept props as it's hardcoded, 
    // but we can document its behavior
  },
} satisfies Meta<typeof User>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Default user component with dropdown menu. Click the avatar to see the dropdown options.",
      },
    },
  },
};

export const InNavigationBar: Story = {
  render: () => (
    <div className="flex items-center justify-between w-full max-w-4xl p-4 bg-white border-b shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-bold text-blue-600">플레이트</div>
        <nav className="flex space-x-6">
          <a href="#" className="text-gray-600 hover:text-gray-900">Dashboard</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Projects</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Team</a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-600 hover:text-gray-900">
          🔔
        </button>
        <User />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "User component integrated into a navigation bar layout.",
      },
    },
  },
};

export const InTopBar: Story = {
  render: () => (
    <div className="w-full bg-white border-b">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <span className="text-sm text-gray-500">Welcome back!</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600">
            <div>Good morning</div>
          </div>
          <User />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "User component in a dashboard top bar layout.",
      },
    },
  },
};

export const InSidebar: Story = {
  render: () => (
    <div className="w-64 h-96 bg-gray-50 border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="text-lg font-bold text-gray-900">플레이트</div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-blue-100 rounded">
          Dashboard
        </a>
        <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-blue-100 rounded">
          Projects
        </a>
        <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-blue-100 rounded">
          Team
        </a>
        <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-blue-100 rounded">
          Settings
        </a>
      </nav>
      
      <div className="p-4 border-t">
        <User />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "User component positioned at the bottom of a sidebar navigation.",
      },
    },
  },
};

export const MultipleUsers: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Team Members</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Project Manager</div>
              <div className="text-sm text-gray-500">Online</div>
            </div>
            <User />
          </div>
        </div>
        
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Developer</div>
              <div className="text-sm text-gray-500">Away</div>
            </div>
            <User />
          </div>
        </div>
        
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Designer</div>
              <div className="text-sm text-gray-500">Offline</div>
            </div>
            <User />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Multiple user components in a team member grid layout.",
      },
    },
  },
};

export const WithNotifications: Story = {
  render: () => (
    <div className="w-full max-w-sm bg-white border rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Account</h3>
          <User />
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Notifications</span>
          <input type="checkbox" className="rounded" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Email Updates</span>
          <input type="checkbox" className="rounded" />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Dark Mode</span>
          <input type="checkbox" className="rounded" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "User component in an account settings card layout.",
      },
    },
  },
};

export const Playground: Story = {
  render: () => (
    <div className="p-8 bg-gray-100 min-h-32 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-600 mb-4">Click the user avatar to see the dropdown menu</div>
        <User />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Playground for testing the user component functionality.",
      },
    },
  },
};
import type { Meta, StoryObj } from "@storybook/react";
import { NavbarItem } from "./NavbarItem";

const meta = {
  title: "UI/NavbarItem",
  component: NavbarItem,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A navigation item component used in navbars and menus. Shows different styling based on active state.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "The text to display in the navigation item",
    },
    url: {
      control: "text",
      description: "The URL to navigate to when clicked",
    },
    active: {
      control: "boolean",
      description: "Whether this navigation item is currently active",
    },
    params: {
      description: "Optional parameters to pass with navigation",
    },
  },
} satisfies Meta<typeof NavbarItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Home",
    url: "/home",
    active: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Default navigation item in inactive state.",
      },
    },
  },
};

export const Active: Story = {
  args: {
    text: "Dashboard",
    url: "/dashboard",
    active: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Navigation item in active state with primary color.",
      },
    },
  },
};

export const LongText: Story = {
  args: {
    text: "Very Long Navigation Item Text",
    url: "/long-page",
    active: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Navigation item with longer text content.",
      },
    },
  },
};

export const NavigationBar: Story = {
  args: {},
  render: () => (
    <div className="flex gap-2 p-4 bg-gray-50 rounded-lg">
      <NavbarItem text="Home" url="/" active={true} />
      <NavbarItem text="Products" url="/products" active={false} />
      <NavbarItem text="Services" url="/services" active={false} />
      <NavbarItem text="About" url="/about" active={false} />
      <NavbarItem text="Contact" url="/contact" active={false} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Example navigation bar with multiple nav items, showing one active item.",
      },
    },
  },
};

export const VerticalNavigation: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-1 p-4 bg-white border rounded-lg w-48">
      <NavbarItem text="Dashboard" url="/dashboard" active={true} />
      <NavbarItem text="Analytics" url="/analytics" active={false} />
      <NavbarItem text="Projects" url="/projects" active={false} />
      <NavbarItem text="Team" url="/team" active={false} />
      <NavbarItem text="Settings" url="/settings" active={false} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Vertical navigation layout with nav items stacked.",
      },
    },
  },
};

export const WithParams: Story = {
  args: {
    text: "User Profile",
    url: "/user",
    active: false,
    params: { userId: "123", tab: "profile" },
  },
  parameters: {
    docs: {
      description: {
        story: "Navigation item with additional parameters for navigation.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    text: "Navigation Item",
    url: "/example",
    active: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different navigation item configurations.",
      },
    },
  },
};
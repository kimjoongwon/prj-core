import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A user avatar component with dropdown menu functionality. Shows user info and environment details.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    showInfo: {
      control: "boolean",
      description:
        "Whether to show full user information (desktop mode) or just avatar (mobile mode)",
      defaultValue: true,
    },
    onMenuAction: {
      action: "menu-action",
      description: "Callback function called when menu item is selected",
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showInfo: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Default avatar with full user information displayed. Shows dropdown menu on click.",
      },
    },
  },
};

export const WithUserInfo: Story = {
  args: {
    showInfo: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Avatar showing full user information including name and role. Suitable for desktop layouts.",
      },
    },
  },
};

export const AvatarOnly: Story = {
  args: {
    showInfo: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Avatar showing only the profile image. Suitable for mobile layouts or compact spaces.",
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    showInfo: true,
    onMenuAction: (key: string) => {
      console.log(`Menu action: ${key}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive avatar that logs menu actions to console. Try clicking different menu items.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    showInfo: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different avatar configurations.",
      },
    },
  },
};

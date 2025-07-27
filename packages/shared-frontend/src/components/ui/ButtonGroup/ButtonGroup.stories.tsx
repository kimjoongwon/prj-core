import type { Meta, StoryObj } from "@storybook/react";
import { ButtonGroup } from "./ButtonGroup";
import type { GroupButton } from "@shared/types";

const meta = {
  title: "UI/ButtonGroup",
  component: ButtonGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A component that displays buttons in left and right groups with flexible layout. Supports both regular buttons and link buttons.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    leftButtons: {
      control: "object",
      description: "Array of buttons to display on the left side",
    },
    rightButtons: {
      control: "object",
      description: "Array of buttons to display on the right side",
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleLeftButtons: GroupButton[] = [
  {
    children: "New",
    color: "primary",
    onPress: () => {},
  },
  {
    children: "Edit",
    color: "default",
    variant: "bordered",
    onPress: () => {},
  },
];

const sampleRightButtons: GroupButton[] = [
  {
    children: "Cancel",
    color: "default",
    variant: "light",
    onPress: () => {},
  },
  {
    children: "Save",
    color: "success",
    onPress: () => {},
  },
];

export const Default: Story = {
  args: {
    leftButtons: sampleLeftButtons,
    rightButtons: sampleRightButtons,
  },
  parameters: {
    docs: {
      description: {
        story: "Default button group with buttons on both left and right sides.",
      },
    },
  },
};

export const LeftOnly: Story = {
  args: {
    leftButtons: [
      {
        children: "Back",
        color: "default",
        variant: "bordered",
        onPress: () => {},
      },
      {
        children: "Refresh",
        color: "primary",
        variant: "light",
        onPress: () => {},
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Button group with buttons only on the left side.",
      },
    },
  },
};

export const RightOnly: Story = {
  args: {
    rightButtons: [
      {
        children: "Close",
        color: "danger",
        variant: "light",
        onPress: () => {},
      },
      {
        children: "Submit",
        color: "primary",
        onPress: () => {},
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Button group with buttons only on the right side.",
      },
    },
  },
};

export const WithLinks: Story = {
  args: {
    leftButtons: [
      {
        children: "Home",
        href: "/",
        color: "primary",
      },
      {
        children: "About",
        href: "/about",
        color: "default",
        variant: "light",
      },
    ],
    rightButtons: [
      {
        children: "Contact",
        href: "/contact",
        color: "secondary",
        variant: "bordered",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Button group with link buttons that navigate to different pages.",
      },
    },
  },
};

export const FormActions: Story = {
  args: {
    leftButtons: [
      {
        children: "Reset",
        color: "warning",
        variant: "light",
        onPress: () => {},
      },
    ],
    rightButtons: [
      {
        children: "Cancel",
        color: "default",
        variant: "bordered",
        onPress: () => {},
      },
      {
        children: "Save Draft",
        color: "secondary",
        variant: "light",
        onPress: () => {},
      },
      {
        children: "Publish",
        color: "success",
        onPress: () => {},
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Button group configured for form actions with reset, cancel, save, and publish options.",
      },
    },
  },
};

export const ToolbarActions: Story = {
  args: {
    leftButtons: [
      {
        children: "← Back",
        color: "default",
        variant: "light",
        onPress: () => {},
      },
      {
        children: "Select All",
        color: "primary",
        variant: "light",
        onPress: () => {},
      },
      {
        children: "Delete Selected",
        color: "danger",
        variant: "light",
        isDisabled: true,
        onPress: () => {},
      },
    ],
    rightButtons: [
      {
        children: "Filter",
        color: "default",
        variant: "bordered",
        onPress: () => {},
      },
      {
        children: "Export",
        color: "secondary",
        onPress: () => {},
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Button group configured as a toolbar with navigation, selection, and action buttons.",
      },
    },
  },
};

export const Empty: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Empty button group with no buttons defined.",
      },
    },
  },
};

export const MixedButtonTypes: Story = {
  args: {
    leftButtons: [
      {
        children: "Link Button",
        href: "/example",
        color: "primary",
      },
      {
        children: "Action Button",
        color: "secondary",
        onPress: () => {},
      },
    ],
    rightButtons: [
      {
        children: "External Link",
        href: "https://example.com",
        color: "default",
        variant: "bordered",
      },
      {
        children: "Submit",
        color: "success",
        onPress: () => {},
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Button group mixing both link buttons and action buttons.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    leftButtons: sampleLeftButtons,
    rightButtons: sampleRightButtons,
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different button group configurations.",
      },
    },
  },
};

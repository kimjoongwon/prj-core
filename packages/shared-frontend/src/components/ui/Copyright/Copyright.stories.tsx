import type { Meta, StoryObj } from "@storybook/react";
import { Copyright } from "./Copyright";

const meta = {
  title: "UI/Copyright",
  component: Copyright,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A simple copyright component that displays the current year and company name with standard copyright formatting.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    companyName: {
      control: "text",
      description: "The name of the company to display in the copyright notice",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
  },
} satisfies Meta<typeof Copyright>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    companyName: "Acme Corp",
  },
  parameters: {
    docs: {
      description: {
        story: "Default copyright notice with company name.",
      },
    },
  },
};

export const WithLongCompanyName: Story = {
  args: {
    companyName: "Very Long Company Name Technologies International Ltd.",
  },
  parameters: {
    docs: {
      description: {
        story: "Copyright notice with a long company name.",
      },
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    companyName: "Custom Styled Corp",
    className: "text-blue-600 font-semibold",
  },
  parameters: {
    docs: {
      description: {
        story: "Copyright notice with custom styling.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    companyName: "Your Company",
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different copyright configurations.",
      },
    },
  },
};
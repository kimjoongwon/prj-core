import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A select dropdown component based on NextUI Select with MobX integration for form state management.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    options: {
      description: "Array of options to display in the select dropdown",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text when no option is selected",
    },
    label: {
      control: "text",
      description: "Label text for the select component",
    },
    isDisabled: {
      control: "boolean",
      description: "Whether the select is disabled",
    },
    isRequired: {
      control: "boolean",
      description: "Whether the select is required",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the select component",
    },
    variant: {
      control: "select",
      options: ["flat", "bordered", "faded", "underlined"],
      description: "Visual variant of the select",
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
      description: "Color theme of the select",
    },
    state: {
      description: "MobX state object for form integration",
    },
    path: {
      control: "text",
      description: "Path in the state object to bind the value",
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample options for stories
const countryOptions = [
  { text: "Korea", value: "kr" },
  { text: "United States", value: "us" },
  { text: "Japan", value: "jp" },
  { text: "China", value: "cn" },
  { text: "United Kingdom", value: "uk" },
];

const roleOptions = [
  { text: "Admin", value: "admin" },
  { text: "Editor", value: "editor" },
  { text: "Viewer", value: "viewer" },
  { text: "Guest", value: "guest" },
];

const categoryOptions = [
  { text: "Technology", value: "tech" },
  { text: "Design", value: "design" },
  { text: "Marketing", value: "marketing" },
  { text: "Sales", value: "sales" },
  { text: "Finance", value: "finance" },
  { text: "Operations", value: "operations" },
];

export const Default: Story = {
  args: {
    options: countryOptions,
    placeholder: "Select a country",
    label: "Country",
  },
  parameters: {
    docs: {
      description: {
        story: "Default select with country options.",
      },
    },
  },
};

export const WithLabel: Story = {
  args: {
    options: roleOptions,
    placeholder: "Choose your role",
    label: "User Role",
    isRequired: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Select with label and required indicator.",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    options: countryOptions,
    placeholder: "Select a country",
    label: "Country",
    isDisabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Disabled select component.",
      },
    },
  },
};

export const Sizes: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Select
        options={categoryOptions}
        placeholder="Small size"
        label="Small"
        size="sm"
      />
      <Select
        options={categoryOptions}
        placeholder="Medium size"
        label="Medium"
        size="md"
      />
      <Select
        options={categoryOptions}
        placeholder="Large size"
        label="Large"
        size="lg"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different sizes of the select component.",
      },
    },
  },
};

export const Variants: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Select
        options={roleOptions}
        placeholder="Flat variant"
        label="Flat"
        variant="flat"
      />
      <Select
        options={roleOptions}
        placeholder="Bordered variant"
        label="Bordered"
        variant="bordered"
      />
      <Select
        options={roleOptions}
        placeholder="Faded variant"
        label="Faded"
        variant="faded"
      />
      <Select
        options={roleOptions}
        placeholder="Underlined variant"
        label="Underlined"
        variant="underlined"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different visual variants of the select component.",
      },
    },
  },
};

export const Colors: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Select
        options={categoryOptions}
        placeholder="Default color"
        label="Default"
        color="default"
      />
      <Select
        options={categoryOptions}
        placeholder="Primary color"
        label="Primary"
        color="primary"
      />
      <Select
        options={categoryOptions}
        placeholder="Secondary color"
        label="Secondary"
        color="secondary"
      />
      <Select
        options={categoryOptions}
        placeholder="Success color"
        label="Success"
        color="success"
      />
      <Select
        options={categoryOptions}
        placeholder="Warning color"
        label="Warning"
        color="warning"
      />
      <Select
        options={categoryOptions}
        placeholder="Danger color"
        label="Danger"
        color="danger"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different color themes of the select component.",
      },
    },
  },
};

export const FormExample: Story = {
  args: {},
  render: () => (
    <div className="max-w-md p-6 bg-white border rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">User Information</h3>
      <div className="flex flex-col gap-4">
        <Select
          options={countryOptions}
          placeholder="Select country"
          label="Country"
          isRequired
        />
        <Select
          options={roleOptions}
          placeholder="Select role"
          label="Role"
          isRequired
        />
        <Select
          options={categoryOptions}
          placeholder="Select department"
          label="Department"
        />
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Submit
        </button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Select components used in a form layout.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    options: countryOptions,
    placeholder: "Select an option",
    label: "Label",
    size: "md",
    variant: "bordered",
    color: "default",
    isRequired: false,
    isDisabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different select configurations.",
      },
    },
  },
};
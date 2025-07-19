import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "@shared/frontend";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";

// Mock state for Checkbox stories
const createMockState = (initialValue = false) => {
  return observable({
    checkbox: {
      value: initialValue,
    },
  });
};

// Wrapper component to handle MobX state
const CheckboxWrapper = observer(
  ({
    children,
    initialValue = {
      isTest: false,
    },
    ...props
  }: {
    children: React.ReactNode;
    initialValue?: {
      isTest?: boolean;
    };
    [key: string]: any;
  }) => {
    const _state = createMockState(initialValue);

    return (
      <Checkbox path={"isTest"} state={undefined}>
        {children}
      </Checkbox>
    );
  },
);

const meta = {
  title: "Shared/Checkbox",
  component: CheckboxWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
    },
    isDisabled: {
      control: "boolean",
    },
    isInvalid: {
      control: "boolean",
    },
    isIndeterminate: {
      control: "boolean",
    },
    initialValue: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof CheckboxWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default Checkbox",
  },
};

export const Checked: Story = {
  args: {
    children: "Checked Checkbox",
    initialValue: true,
  },
};

export const Primary: Story = {
  args: {
    children: "Primary Checkbox",
    color: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Checkbox",
    color: "secondary",
  },
};

export const Success: Story = {
  args: {
    children: "Success Checkbox",
    color: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "Warning Checkbox",
    color: "warning",
  },
};

export const Danger: Story = {
  args: {
    children: "Danger Checkbox",
    color: "danger",
  },
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <CheckboxWrapper color="default">Default</CheckboxWrapper>
      <CheckboxWrapper color="primary">Primary</CheckboxWrapper>
      <CheckboxWrapper color="secondary">Secondary</CheckboxWrapper>
      <CheckboxWrapper color="success">Success</CheckboxWrapper>
      <CheckboxWrapper color="warning">Warning</CheckboxWrapper>
      <CheckboxWrapper color="danger">Danger</CheckboxWrapper>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <CheckboxWrapper size="sm" color="primary">
        Small
      </CheckboxWrapper>
      <CheckboxWrapper size="md" color="primary">
        Medium
      </CheckboxWrapper>
      <CheckboxWrapper size="lg" color="primary">
        Large
      </CheckboxWrapper>
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <CheckboxWrapper radius="none" color="primary">
        None
      </CheckboxWrapper>
      <CheckboxWrapper radius="sm" color="primary">
        Small
      </CheckboxWrapper>
      <CheckboxWrapper radius="md" color="primary">
        Medium
      </CheckboxWrapper>
      <CheckboxWrapper radius="lg" color="primary">
        Large
      </CheckboxWrapper>
      <CheckboxWrapper radius="full" color="primary">
        Full
      </CheckboxWrapper>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <CheckboxWrapper color="primary">Normal</CheckboxWrapper>
      <CheckboxWrapper color="primary" initialValue={true}>
        Checked
      </CheckboxWrapper>
      <CheckboxWrapper color="primary" isDisabled>
        Disabled
      </CheckboxWrapper>
      <CheckboxWrapper color="primary" isDisabled initialValue={true}>
        Disabled Checked
      </CheckboxWrapper>
      <CheckboxWrapper color="primary" isInvalid>
        Invalid
      </CheckboxWrapper>
      <CheckboxWrapper color="primary" isIndeterminate>
        Indeterminate
      </CheckboxWrapper>
    </div>
  ),
};

export const LongText: Story = {
  args: {
    children:
      "This is a checkbox with a very long text that should wrap properly and demonstrate how the checkbox component handles longer content labels.",
    color: "primary",
  },
  parameters: {
    layout: "padded",
  },
};

export const WithoutText: Story = {
  args: {
    children: "",
    color: "primary",
  },
};

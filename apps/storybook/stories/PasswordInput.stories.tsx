import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordInput } from "@shared/frontend";
import { Validation } from "@shared/types";

type PasswordState = {
  password?: string;
  required?: string;
  invalid?: string;
  disabled?: string;
  bordered?: string;
  filled?: string;
};

const meta = {
  title: "입력 컴포넌트/PasswordInput",
  component: PasswordInput<PasswordState>,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    path: {
      control: "text",
      description: "상태 객체의 경로",
    },
    state: {
      control: "object",
      description: "상태 객체",
    },
    validation: {
      control: "object",
      description: "유효성 검사 설정",
    },
    variant: {
      control: "select",
      options: ["bordered", "filled"],
      description: "입력 필드 스타일 변형",
    },
    isDisabled: {
      control: "boolean",
      description: "비활성화 상태",
    },
    isRequired: {
      control: "boolean",
      description: "필수 입력 여부",
    },
    isInvalid: {
      control: "boolean",
      description: "유효성 검사 실패 상태",
    },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  args: {
    state: { password: "" },
    path: "password",
  },
};

export const 필수입력: Story = {
  args: {
    state: { required: "" },
    path: "required",
    isRequired: true,
  },
};

export const 오류상태: Story = {
  args: {
    state: { invalid: "weak-password" },
    path: "invalid",
    isInvalid: true,
  },
};

export const 비활성화: Story = {
  args: {
    state: { disabled: "" },
    path: "disabled",
    isDisabled: true,
  },
};

export const 유효성검사: Story = {
  args: {
    state: { password: "" },
    path: "password",
    validation: {
      required: "비밀번호를 입력해주세요.",
      minLength: {
        value: 8,
        message: "비밀번호는 최소 8자 이상이어야 합니다.",
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message: "비밀번호는 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.",
      },
    } as Validation,
  },
};

export const 스타일변형: Story = {
  args: {
    path: "bordered",
    state: { bordered: "" },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <PasswordInput variant="bordered" state={{ bordered: "" }} path="bordered" />
      <PasswordInput variant="filled" state={{ filled: "" }} path="filled" />
    </div>
  ),
};
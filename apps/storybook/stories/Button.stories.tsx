import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@shared/frontend";

const meta = {
  title: "공유 컴포넌트/버튼",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
      description: "버튼의 색상 테마",
    },
    variant: {
      control: "select",
      options: ["solid", "bordered", "light", "flat", "faded", "shadow", "ghost"],
      description: "버튼의 스타일 변형",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "버튼의 크기",
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
      description: "버튼의 모서리 둥근 정도",
    },
    isDisabled: {
      control: "boolean",
      description: "버튼 비활성화 상태",
    },
    isLoading: {
      control: "boolean",
      description: "버튼 로딩 상태",
    },
    fullWidth: {
      control: "boolean",
      description: "전체 너비 사용 여부",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  args: {
    children: "버튼",
  },
};

export const 주요버튼: Story = {
  args: {
    children: "주요 버튼",
    color: "primary",
  },
};

export const 보조버튼: Story = {
  args: {
    children: "보조 버튼",
    color: "secondary",
  },
};

export const 성공버튼: Story = {
  args: {
    children: "성공 버튼",
    color: "success",
  },
};

export const 경고버튼: Story = {
  args: {
    children: "경고 버튼",
    color: "warning",
  },
};

export const 위험버튼: Story = {
  args: {
    children: "위험 버튼",
    color: "danger",
  },
};

export const 다양한스타일: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="solid" color="primary">
        고체
      </Button>
      <Button variant="bordered" color="primary">
        테두리
      </Button>
      <Button variant="light" color="primary">
        연한색
      </Button>
      <Button variant="flat" color="primary">
        평면
      </Button>
      <Button variant="faded" color="primary">
        흐린색
      </Button>
      <Button variant="shadow" color="primary">
        그림자
      </Button>
      <Button variant="ghost" color="primary">
        투명
      </Button>
    </div>
  ),
};

export const 다양한크기: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm" color="primary">
        작음
      </Button>
      <Button size="md" color="primary">
        보통
      </Button>
      <Button size="lg" color="primary">
        큼
      </Button>
    </div>
  ),
};

export const 모서리둥근정도: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button radius="none" color="primary">
        각진모서리
      </Button>
      <Button radius="sm" color="primary">
        약간둥근
      </Button>
      <Button radius="md" color="primary">
        보통둥근
      </Button>
      <Button radius="lg" color="primary">
        많이둥근
      </Button>
      <Button radius="full" color="primary">
        완전둥근
      </Button>
    </div>
  ),
};

export const 버튼상태: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button color="primary">일반상태</Button>
      <Button color="primary" isDisabled>
        비활성화
      </Button>
      <Button color="primary" isLoading>
        로딩중
      </Button>
    </div>
  ),
};

export const 전체너비: Story = {
  args: {
    children: "전체 너비 버튼",
    color: "primary",
    fullWidth: true,
  },
  parameters: {
    layout: "padded",
  },
};

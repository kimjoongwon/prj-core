import { Button, ButtonGroup } from '@shared/frontend';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Shared Frontend/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'ButtonGroup 컴포넌트입니다. 여러 버튼을 그룹으로 묶어서 표시합니다.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '버튼 그룹 크기',
    },
    variant: {
      control: 'select',
      options: ['solid', 'bordered', 'light', 'flat', 'faded', 'shadow', 'ghost'],
      description: '스타일 variant',
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
      description: '색상 테마',
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      description: '모서리 둥글기',
    },
    isDisabled: { control: 'boolean', description: '비활성화 상태' },
    fullWidth: { control: 'boolean', description: '전체 너비 사용' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    variant: 'solid',
    color: 'default',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>첫 번째</Button>
      <Button>두 번째</Button>
      <Button>세 번째</Button>
    </ButtonGroup>
  ),
};

export const Primary: Story = {
  args: {
    size: 'md',
    variant: 'solid',
    color: 'primary',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>옵션 1</Button>
      <Button>옵션 2</Button>
      <Button>옵션 3</Button>
    </ButtonGroup>
  ),
};

export const Bordered: Story = {
  args: {
    size: 'md',
    variant: 'bordered',
    color: 'primary',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>저장</Button>
      <Button>취소</Button>
      <Button>삭제</Button>
    </ButtonGroup>
  ),
};

export const Small: Story = {
  args: {
    size: 'sm',
    variant: 'solid',
    color: 'secondary',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>S</Button>
      <Button>M</Button>
      <Button>L</Button>
      <Button>XL</Button>
    </ButtonGroup>
  ),
};

export const Large: Story = {
  args: {
    size: 'lg',
    variant: 'flat',
    color: 'success',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>승인</Button>
      <Button>거절</Button>
    </ButtonGroup>
  ),
};

export const Disabled: Story = {
  args: {
    size: 'md',
    variant: 'solid',
    color: 'default',
    isDisabled: true,
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>비활성화</Button>
      <Button>버튼</Button>
      <Button>그룹</Button>
    </ButtonGroup>
  ),
};

export const FullWidth: Story = {
  args: {
    size: 'md',
    variant: 'bordered',
    color: 'primary',
    fullWidth: true,
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>좌측</Button>
      <Button>중앙</Button>
      <Button>우측</Button>
    </ButtonGroup>
  ),
};

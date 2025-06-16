import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from '@shared/frontend';
import { Radio } from '@heroui/react';

const meta: Meta<typeof RadioGroup> = {
  title: 'Shared Frontend/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'RadioGroup 컴포넌트입니다. 여러 옵션 중 하나를 선택할 때 사용합니다.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: '라벨 텍스트' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '컴포넌트 크기',
    },
    color: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
      ],
      description: '색상 테마',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: '배치 방향',
    },
    isDisabled: { control: 'boolean', description: '비활성화 상태' },
    isRequired: { control: 'boolean', description: '필수 입력 여부' },
    isInvalid: { control: 'boolean', description: '오류 상태' },
    description: { control: 'text', description: '설명 텍스트' },
    errorMessage: { control: 'text', description: '오류 메시지' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: '선호하는 색상을 선택하세요',
    size: 'md',
    color: 'primary',
    orientation: 'vertical',
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="red">빨강</Radio>
      <Radio value="blue">파랑</Radio>
      <Radio value="green">초록</Radio>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  args: {
    label: '성별',
    size: 'md',
    color: 'primary',
    orientation: 'horizontal',
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="male">남성</Radio>
      <Radio value="female">여성</Radio>
      <Radio value="other">기타</Radio>
    </RadioGroup>
  ),
};

export const WithDescription: Story = {
  args: {
    label: '알림 설정',
    description: '받고 싶은 알림 유형을 선택하세요',
    size: 'md',
    color: 'primary',
    orientation: 'vertical',
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="all">모든 알림</Radio>
      <Radio value="important">중요한 알림만</Radio>
      <Radio value="none">알림 받지 않음</Radio>
    </RadioGroup>
  ),
};

export const Required: Story = {
  args: {
    label: '약관 동의',
    isRequired: true,
    size: 'md',
    color: 'primary',
    orientation: 'vertical',
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="agree">동의합니다</Radio>
      <Radio value="disagree">동의하지 않습니다</Radio>
    </RadioGroup>
  ),
};

export const Invalid: Story = {
  args: {
    label: '필수 선택 항목',
    isRequired: true,
    isInvalid: true,
    errorMessage: '반드시 하나의 옵션을 선택해야 합니다',
    size: 'md',
    color: 'danger',
    orientation: 'vertical',
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="option1">옵션 1</Radio>
      <Radio value="option2">옵션 2</Radio>
      <Radio value="option3">옵션 3</Radio>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  args: {
    label: '비활성화된 선택',
    isDisabled: true,
    size: 'md',
    color: 'default',
    orientation: 'vertical',
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="option1">옵션 1</Radio>
      <Radio value="option2">옵션 2</Radio>
      <Radio value="option3">옵션 3</Radio>
    </RadioGroup>
  ),
};

export const Small: Story = {
  args: {
    label: '소형 라디오 그룹',
    size: 'sm',
    color: 'secondary',
    orientation: 'horizontal',
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="xs">XS</Radio>
      <Radio value="s">S</Radio>
      <Radio value="m">M</Radio>
      <Radio value="l">L</Radio>
    </RadioGroup>
  ),
};

export const Large: Story = {
  args: {
    label: '대형 라디오 그룹',
    size: 'lg',
    color: 'success',
    orientation: 'vertical',
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="beginner">초급</Radio>
      <Radio value="intermediate">중급</Radio>
      <Radio value="advanced">고급</Radio>
    </RadioGroup>
  ),
};

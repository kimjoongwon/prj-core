import { Message } from '@shared/frontend';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Message> = {
  title: 'Shared Frontend/Message',
  component: Message,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Message 알림 컴포넌트입니다. 사용자에게 메시지를 표시할 때 사용합니다.',
      },
    },
  },
  argTypes: {
    children: { control: 'text', description: '메시지 내용' },
    title: { control: 'text', description: '메시지 제목' },
    description: { control: 'text', description: '메시지 설명' },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
      description: '색상 테마',
    },
    variant: {
      control: 'select',
      options: ['solid', 'bordered', 'light', 'flat', 'faded'],
      description: '스타일 variant',
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      description: '모서리 둥글기',
    },
    startContent: { control: 'text', description: '시작 아이콘/내용' },
    endContent: { control: 'text', description: '끝 아이콘/내용' },
    isClosable: { control: 'boolean', description: '닫기 버튼 표시' },
    onClose: { action: 'close', description: '닫기 버튼 클릭 이벤트' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '기본 메시지입니다.',
  },
};

export const WithTitle: Story = {
  args: {
    title: '알림',
    children: '제목이 있는 메시지입니다.',
  },
};

export const WithTitleAndDescription: Story = {
  args: {
    title: '중요한 알림',
    description: '이것은 설명이 포함된 메시지입니다.',
    children: '자세한 내용은 여기에 표시됩니다.',
  },
};

export const Success: Story = {
  args: {
    title: '성공',
    children: '작업이 성공적으로 완료되었습니다.',
    color: 'success',
    startContent: '✅',
  },
};

export const Warning: Story = {
  args: {
    title: '주의',
    children: '주의가 필요한 상황입니다.',
    color: 'warning',
    startContent: '⚠️',
  },
};

export const Danger: Story = {
  args: {
    title: '오류',
    children: '오류가 발생했습니다. 다시 시도해주세요.',
    color: 'danger',
    startContent: '❌',
  },
};

export const Primary: Story = {
  args: {
    title: '정보',
    children: '중요한 정보를 확인해주세요.',
    color: 'primary',
    startContent: 'ℹ️',
  },
};

export const Secondary: Story = {
  args: {
    title: '보조 정보',
    children: '추가적인 정보입니다.',
    color: 'secondary',
    startContent: '📝',
  },
};

export const Closable: Story = {
  args: {
    title: '닫을 수 있는 메시지',
    children: '이 메시지는 닫기 버튼이 있습니다.',
    color: 'primary',
    isClosable: true,
  },
};

export const WithEndContent: Story = {
  args: {
    title: '액션이 있는 메시지',
    children: '오른쪽에 액션 버튼이 있습니다.',
    color: 'primary',
    endContent: '→',
  },
};

export const Bordered: Story = {
  args: {
    title: 'Bordered 스타일',
    children: 'Bordered 스타일의 메시지입니다.',
    variant: 'bordered',
    color: 'primary',
  },
};

export const Light: Story = {
  args: {
    title: 'Light 스타일',
    children: 'Light 스타일의 메시지입니다.',
    variant: 'light',
    color: 'primary',
  },
};

export const Flat: Story = {
  args: {
    title: 'Flat 스타일',
    children: 'Flat 스타일의 메시지입니다.',
    variant: 'flat',
    color: 'primary',
  },
};

export const Faded: Story = {
  args: {
    title: 'Faded 스타일',
    children: 'Faded 스타일의 메시지입니다.',
    variant: 'faded',
    color: 'primary',
  },
};

export const FullRadius: Story = {
  args: {
    title: '완전 둥근 메시지',
    children: '모서리가 완전히 둥근 메시지입니다.',
    radius: 'full',
    color: 'primary',
  },
};

export const NoRadius: Story = {
  args: {
    title: '각진 메시지',
    children: '모서리가 각진 메시지입니다.',
    radius: 'none',
    color: 'primary',
  },
};

export const MessageTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <Message color="success" startContent="✅" title="성공">
        작업이 성공적으로 완료되었습니다.
      </Message>
      <Message color="warning" startContent="⚠️" title="경고">
        주의가 필요한 상황입니다.
      </Message>
      <Message color="danger" startContent="❌" title="오류">
        오류가 발생했습니다.
      </Message>
      <Message color="primary" startContent="ℹ️" title="정보">
        중요한 정보를 확인해주세요.
      </Message>
    </div>
  ),
};

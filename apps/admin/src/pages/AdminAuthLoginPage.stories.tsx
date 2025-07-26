import type { Meta, StoryObj } from "@storybook/react-vite";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import { Button, LoginForm, Logo, Text } from "@shared/frontend";

// Create a story-specific component without Outlet
const AdminAuthLoginPageStory = observer(
  (props: {
    state: { loginForm: { email: string; password: string } };
    handlers: { onClickLogin: () => Promise<void> };
  }) => {
    const { state, handlers } = props;

    return (
      <>
        <Logo variants="text" />
        <Text variant="h5">관리자 로그인</Text>
        <LoginForm state={state.loginForm} />
        <Button fullWidth type="submit" onPress={handlers.onClickLogin} color="primary">
          로그인
        </Button>
        {/* Outlet removed for Storybook */}
      </>
    );
  },
);

// Story wrapper components that handle MobX observables internally
const DefaultStory = observer(() => {
  const mockProps = {
    state: observable({
      loginForm: {
        email: "plate@gmail.com",
        password: "rkdmf12!@",
      },
    }),
    handlers: {
      onClickLogin: async () => console.log("Login clicked"),
    },
  };

  return <AdminAuthLoginPageStory {...mockProps} />;
});

const EmptyFormStory = observer(() => {
  const mockProps = {
    state: observable({
      loginForm: {
        email: "",
        password: "",
      },
    }),
    handlers: {
      onClickLogin: async () => console.log("Login clicked - empty form"),
    },
  };

  return <AdminAuthLoginPageStory {...mockProps} />;
});

const FilledFormStory = observer(() => {
  const mockProps = {
    state: observable({
      loginForm: {
        email: "admin@company.com",
        password: "password123",
      },
    }),
    handlers: {
      onClickLogin: async () => console.log("Login clicked - filled form"),
    },
  };

  return <AdminAuthLoginPageStory {...mockProps} />;
});

const meta: Meta = {
  title: "Pages/AdminAuthLoginPage",
  parameters: {
    docs: {
      description: {
        component: "관리자 로그인 페이지 컴포넌트입니다.",
      },
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div
        style={{
          width: "400px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: "기본 상태",
  render: () => <DefaultStory />,
  parameters: {
    docs: {
      description: {
        story: "기본 관리자 로그인 페이지입니다.",
      },
    },
  },
};

export const EmptyForm: Story = {
  name: "빈 폼 상태",
  render: () => <EmptyFormStory />,
  parameters: {
    docs: {
      description: {
        story: "이메일과 비밀번호가 비어있는 상태입니다.",
      },
    },
  },
};

export const FilledForm: Story = {
  name: "입력된 폼 상태",
  render: () => <FilledFormStory />,
  parameters: {
    docs: {
      description: {
        story: "이메일과 비밀번호가 입력된 상태입니다.",
      },
    },
  },
};

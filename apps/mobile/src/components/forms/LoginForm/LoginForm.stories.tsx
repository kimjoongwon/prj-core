import type { Meta, StoryObj } from "@storybook/react-native";
import React from "react";
import { observable } from "mobx";
import { LoginForm } from "./LoginForm";
import type { LoginFormProps, LoginFormState } from "./LoginForm";

const meta: Meta<LoginFormProps> = {
  title: "forms/LoginForm",
  component: LoginForm,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "이메일과 비밀번호를 입력받는 로그인 폼 컴포넌트입니다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<LoginFormProps>;

export const 기본: Story = {
  render: () => {
    const state = observable<LoginFormState>({
      email: "",
      password: "",
    });

    return <LoginForm state={state} />;
  },
};

export const 입력된상태: Story = {
  render: () => {
    const state = observable<LoginFormState>({
      email: "user@example.com",
      password: "password123",
    });

    return <LoginForm state={state} />;
  },
};

export const 플레이그라운드: Story = {
  render: () => {
    const state = observable<LoginFormState>({
      email: "",
      password: "",
    });

    return <LoginForm state={state} />;
  },
};

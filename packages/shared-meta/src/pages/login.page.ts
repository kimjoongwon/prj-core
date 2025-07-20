import { InputProps } from "@heroui/react";
import { IButtonBuilder, PageBuilder } from "@shared/types";

interface LoginDto {
  email: string;
  password: string;
}

export const getLoginPage = (): PageBuilder => {
  // 기본 로그인 데이터
  const formInputs: LoginDto = {
    email: "plate@gmail.com",
    password: "rkdmf12!@",
  };

  return {
    name: "로그인",
    state: {
      form: {
        inputs: formInputs,
      },
    },
    elements: [
      {
        name: "VStack",
        props: {
          h: 30,
          className: "space-y-4 max-w-md mx-auto mt-16",
        },
        children: [
          {
            name: "Logo",
          },
          {
            name: "Spacer",
            props: {
              size: "20",
            },
          },
          {
            name: "Text",
            props: {
              children: "로그인",
              variant: "h1",
              className: "text-center text-2xl font-bold mb-6",
            },
          },
          {
            name: "Input",
            props: {
              label: "이메일",
              path: "form.inputs.email",
              type: "email",
              variant: "bordered",
            } as InputProps,
          },
          {
            name: "Input",
            props: {
              label: "비밀번호",
              path: "form.inputs.password",
              type: "password",
              variant: "bordered",
            } as InputProps,
          },
          {
            name: "Spacer",
            props: {
              size: "2",
            },
          },
          {
            name: "ButtonBuilder",
            props: {
              children: "로그인",
              color: "primary",
              size: "lg",
              variant: "solid",
              className: "w-full",
              mutation: {
                name: "getToken",
                validationFields: {
                  "form.inputs.email": {
                    required: { value: true, message: "이메일은 필수입니다" },
                    patterns: [
                      {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "올바른 이메일 형식이 아닙니다",
                      },
                    ],
                  },
                  "form.inputs.password": {
                    required: { value: true, message: "비밀번호는 필수입니다" },
                    minLength: { value: 6, message: "비밀번호는 최소 6자 이상이어야 합니다" },
                  },
                },
              },
              navigator: {
                type: "push",
                route: {
                  fullPath: "/admin/auth/login/tenant-select",
                },
              },
            } satisfies IButtonBuilder,
          },
        ],
      },
    ],
  };
};

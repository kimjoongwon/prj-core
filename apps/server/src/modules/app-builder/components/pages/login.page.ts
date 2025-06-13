import { InputProps } from '@heroui/react';
import { Injectable } from '@nestjs/common';
import { IButtonBuilder, PageBuilder, SectionBuilder } from '@shared/types';

interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class LoginPage {
  build(): PageBuilder {
    // 기본 로그인 데이터
    const formInputs: LoginDto = {
      email: 'plate@gmail.com',
      password: 'rkdmf12!@',
    };

    // 섹션 구성
    const sections: SectionBuilder[] = [
      {
        stacks: [
          {
            type: 'VStack' as const,
            elements: [
              {
                name: 'Logo',
              },
              {
                name: 'Spacer',
                props: {
                  size: '4',
                },
              },
              {
                name: 'Form',
                children: [
                  {
                    name: 'Input',
                    props: {
                      label: '이메일',
                      placeholder: '이메일을 입력하세요',
                      type: 'email',
                    } as InputProps,
                    path: 'form.inputs.email',
                    validation: {
                      timings: ['onBlur', 'onChange'],
                      required: { value: true, message: '이메일을 입력해주세요' },
                      patterns: [
                        {
                          value: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$',
                          message: '올바른 이메일 형식이 아닙니다',
                        },
                      ],
                    },
                  },
                  {
                    name: 'Input',
                    props: {
                      label: '비밀번호',
                      placeholder: '비밀번호를 입력하세요',
                      type: 'password',
                    },
                    path: 'form.inputs.password',
                    validation: {
                      timings: ['onBlur', 'onChange'],
                      required: { value: true, message: '비밀번호를 입력해주세요' },
                      minLength: { value: 8, message: '비밀번호는 최소 8자 이상이어야 합니다' },
                    },
                  },
                ],
              },
              {
                name: 'Spacer',
                props: {
                  size: '4',
                },
              },
            ],
          },
          {
            type: 'VStack' as const,
            elements: [
              {
                name: 'ButtonBuilder',
                props: {
                  buttonType: 'form',
                  mutation: {
                    name: 'getToken',
                    path: 'form.inputs',
                  },
                  children: '로그인',
                  color: 'primary',
                  fullWidth: true,
                  navigator: {
                    route: {
                      name: '테넌트 선택',
                    },
                  },
                } satisfies IButtonBuilder,
              },
              {
                name: 'ButtonBuilder',
                props: {
                  variant: 'light',
                  children: '회원가입',
                  color: 'secondary',
                  fullWidth: true,
                } satisfies IButtonBuilder,
              },
              {
                name: 'Copyright',
                props: {
                  companyName: 'Plate',
                },
              },
            ],
          },
        ],
      },
    ];

    return {
      name: '로그인',
      state: { form: { inputs: formInputs, button: { errorMessages: [] } } },
      sections,
    };
  }
}

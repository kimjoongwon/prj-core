import { InputProps } from '@heroui/react';
import { Injectable } from '@nestjs/common';
import { ElementBuilder, PageBuilder, SectionBuilder } from '@shared/specs';

interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class LoginPage {
  private getDefaultLoginDto(): LoginDto {
    return {
      email: 'plate@gmail.com',
      password: 'rkdmf12!@',
    };
  }

  private buildSections(elements: ElementBuilder[]): SectionBuilder[] {
    return [
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
              ...elements,
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
                  apiKey: 'loginButton',
                  children: '로그인',
                  color: 'primary',
                  fullWidth: true,
                },
              },
              {
                name: 'ButtonBuilder',
                props: {
                  children: '회원가입',
                  color: 'secondary',
                  fullWidth: true,
                },
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
  }

  // 직접 입력 필드를 생성하는 메서드
  private createInputElements(): ElementBuilder[] {
    return [
      {
        name: 'Input',
        props: {
          label: '이메일',
          placeholder: '이메일을 입력하세요',
          type: 'email',
        } as InputProps,
        path: 'form.inputs.email',
        validation: {
          required: { value: true, message: '이메일을 입력해주세요' },
          patterns: [
            {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
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
          required: { value: true, message: '비밀번호를 입력해주세요' },
          minLength: { value: 8, message: '비밀번호는 최소 8자 이상이어야 합니다' },
        },
      },
    ] as ElementBuilder[];
  }

  build(): PageBuilder {
    const inputs = this.createInputElements();
    const formInputs = this.getDefaultLoginDto();
    const sections = this.buildSections(inputs);

    // 직접 form 객체 생성
    const form = {
      id: 'login',
      type: 'create',
      resourceName: 'Auth',
      resourceLabel: '로그인',
      button: undefined,
      sections,
    };

    return {
      name: '로그인',
      state: { form: { inputs: formInputs } },
      form,
    };
  }

  // 기존 호환성을 위한 메서드들
  getState() {
    const state = {
      form: {
        elements: this.getDefaultLoginDto(),
      },
    };
    return state;
  }
}

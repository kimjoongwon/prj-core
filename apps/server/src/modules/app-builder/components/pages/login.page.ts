import { Injectable } from '@nestjs/common';
import { ButtonBuilder, ElementBuilder, PageBuilder, SectionBuilder } from '@shared/types';
import { FormBuilderService } from '../form/form-builder.service';
import { ElementBuilderService } from '../Input/Input-builder.service';
import { ButtonBuilderService } from '../button/button-builder.service';

interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class LoginPage {
  constructor(
    private readonly formBuilderService: FormBuilderService,
    private readonly elementBuilderService: ElementBuilderService,
    private readonly buttonBuilderService: ButtonBuilderService,
  ) {}

  private getDefaultLoginDto(): LoginDto {
    return {
      email: 'plate@gmail.com',
      password: 'rkdmf12!@',
    };
  }

  private createLoginButton(): ButtonBuilder {
    return this.buttonBuilderService.build({
      name: '로그인',
      mutation: {
        name: 'getToken',
        payloadPath: 'form.elements',
      },
      toast: {
        title: '성공',
        description: '로그인되었습니다.',
      },
      navigator: {
        type: 'push' as const,
        pathname: '/admin/main/tenants',
      },
      buttonProps: {
        size: 'md',
        fullWidth: true,
        color: 'primary',
      },
    });
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
                name: 'Button',
                props: {
                  children: '로그인',
                  color: 'primary',
                  fullWidth: true,
                },
              },
              {
                name: 'Button',
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

  build(): PageBuilder {
    const inputs = this.elementBuilderService.build(['email', 'password']);
    const button = this.createLoginButton();
    const formInputs = this.getDefaultLoginDto();
    const sections = this.buildSections(inputs);
    const form = this.formBuilderService.build({
      id: 'login',
      type: 'create',
      resourceName: 'Auth',
      resourceLabel: '로그인',
      button,
      sections,
    });

    return {
      name: '로그인',
      state: { form: { elements: formInputs } },
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

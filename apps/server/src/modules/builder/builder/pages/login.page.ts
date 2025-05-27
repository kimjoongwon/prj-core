import { Injectable } from '@nestjs/common';
import { ButtonBuilder, PageBuilder, SectionBuilder } from '@shared/types';
import { FormBuilderService } from '../form/form-builder.service';
import { InputBuilderService } from '../Input/Input-builder.service';
import { ButtonBuilderService } from '../button/button-builder.service';

interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class LoginPage {
  constructor(
    private readonly formBuilderService: FormBuilderService,
    private readonly inputBuilderService: InputBuilderService,
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
        payloadPath: 'form.inputs',
      },
      toast: {
        title: '성공',
        description: '로그인되었습니다.',
      },
      navigator: {
        type: 'push' as const,
        pathname: '/admin/main/tenants',
      },
    });
  }

  private buildSections(inputs: any[]): SectionBuilder[] {
    return [
      {
        name: '로그인',
        stacks: [
          {
            type: 'VStack' as const,
            inputs,
          },
        ],
      },
    ];
  }

  build(): PageBuilder {
    const inputs = this.inputBuilderService.build(['email', 'password']);
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
      state: { form: { inputs: formInputs } },
      form,
    };
  }

  // 기존 호환성을 위한 메서드들
  getState() {
    const state = {
      form: {
        inputs: this.getDefaultLoginDto(),
      },
    };
    return state;
  }
}

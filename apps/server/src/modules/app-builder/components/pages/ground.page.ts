import { Injectable } from '@nestjs/common';
import { ButtonBuilder, PageBuilder, SectionBuilder } from '@shared/types';
import { FormBuilderService } from '../form/form-builder.service';
import { InputBuilderService } from '../Input/Input-builder.service';
import { CreateGroundDto } from '../../../../shared/dto';
import { ContextProvider } from '../../../../shared/provider/context.provider';
import { GroundsRepository } from '../../../../shared/repository';

@Injectable()
export class GroundPage {
  constructor(
    private readonly formBuilderService: FormBuilderService,
    private readonly inputBuilderService: InputBuilderService,
    private readonly groundsRepository: GroundsRepository,
  ) {}

  private getDefaultCDO(): CreateGroundDto {
    return {
      workspace: {
        name: '',
        label: '',
        phone: '',
        email: '',
        address: '',
        businessNo: '',
        logoImageDepotId: '',
      },
      imageDepotId: '',
    };
  }

  private buildSections(inputs: any[]): SectionBuilder[] {
    return [
      {
        name: '기본 정보',
        stacks: [
          {
            type: 'VStack',
            inputs,
          },
        ],
      },
    ];
  }

  private buildForm(sections: SectionBuilder[], isUpdate: boolean, groundId: string | 'new') {
    const button: ButtonBuilder = {
      name: '저장',
      mutation: {
        invalidationKey: '/api/v1/grounds',
        name: isUpdate ? 'updateGround' : 'createGround',
        params: {
          serviceId: ContextProvider.getServiceId(),
          tenantId: ContextProvider.getTenantId(),
        },
      },
      toast: {
        title: '성공',
        description: isUpdate ? '헬스장이 수정되었습니다.' : '헬스장이 생성되었습니다.',
      },
    };

    const formType = isUpdate ? 'modify' : 'create';

    return this.formBuilderService.build({
      id: groundId,
      type: formType,
      resourceName: 'Ground',
      resourceLabel: '그라운드',
      sections,
      button,
    });
  }

  async build(
    groundId: string | 'new',
    type: 'create' | 'modify' | 'detail',
  ): Promise<PageBuilder> {
    const isUpdate = groundId !== 'new' && type === 'modify';
    const isDetail = type === 'detail';

    this.inputBuilderService.setPathBase('form.inputs.workspace');

    const inputs = this.inputBuilderService.build(
      ['name', 'label', 'phone', 'email', 'address', 'businessNo'],
      'form.inputs.workspace',
    );

    const groundDepotIdInput = this.inputBuilderService.getDepotUploaderInput({
      path: 'form.inputs.imageDepotId',
      type: 'image',
      label: '그라운드 이미지',
    });

    const logoImageDepotIdInput = this.inputBuilderService.getDepotUploaderInput({
      path: 'form.inputs.workspace.logoImageDepotId',
      type: 'image',
      label: '로고 이미지',
    });

    const sections = this.buildSections(inputs);

    sections[0].stacks.push({
      type: 'HStack',
      inputs: [groundDepotIdInput, logoImageDepotIdInput],
    });

    const form = this.buildForm(sections, isUpdate, groundId);

    const page: PageBuilder = {
      name: '그라운드',
      form,
      state: {
        form: {
          inputs: this.getDefaultCDO(),
          button: {
            errorMessages: [],
          },
        },
      },
    };

    if (isDetail || isUpdate) {
      const ground = await this.groundsRepository.findUnique({
        where: { id: groundId },
        include: {
          workspace: {
            include: {
              space: true,
            },
          },
        },
      });
      if (ground) {
        page.state.form.inputs = ground;

        if (isDetail) {
          delete page.form.button;
        }

        if (isUpdate) {
          page.form.button.mutation.id = groundId;
        }
      }
    }
    console.log('page', page.state.form.inputs);
    return page;
  }
}

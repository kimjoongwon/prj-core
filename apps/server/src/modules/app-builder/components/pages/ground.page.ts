import { Injectable } from '@nestjs/common';
import { ButtonBuilder, PageBuilder, SectionBuilder } from '@shared/types';
import { FormBuilderService } from '../form/form-builder.service';
import { ElementBuilderService } from '../Input/Input-builder.service';
import { CreateGroundDto } from '../../../../shared/dto';
import { ContextProvider } from '../../../../shared/provider/context.provider';
import { GroundsRepository } from '../../../../shared/repository';

@Injectable()
export class GroundPage {
  constructor(
    private readonly formBuilderService: FormBuilderService,
    private readonly elementBuilderService: ElementBuilderService,
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

  private buildSections(elements: any[]): SectionBuilder[] {
    return [
      {
        name: '기본 정보',
        stacks: [
          {
            type: 'VStack',
            elements,
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

    this.elementBuilderService.setPathBase('form.elements.workspace');

    const elements = this.elementBuilderService.build(
      ['name', 'label', 'phone', 'email', 'address', 'businessNo'],
      'form.elements.workspace',
    );

    const groundDepotIdInput = this.elementBuilderService.getDepotUploaderInput({
      path: 'form.elements.imageDepotId',
      type: 'image',
      label: '그라운드 이미지',
    });

    const logoImageDepotIdInput = this.elementBuilderService.getDepotUploaderInput({
      path: 'form.elements.workspace.logoImageDepotId',
      type: 'image',
      label: '로고 이미지',
    });

    const sections = this.buildSections(elements);

    sections[0].stacks.push({
      type: 'HStack',
      elements: [groundDepotIdInput, logoImageDepotIdInput],
    });

    const form = this.buildForm(sections, isUpdate, groundId);

    const page: PageBuilder = {
      name: '그라운드',
      form,
      state: {
        form: {
          elements: this.getDefaultCDO(),
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
        page.state.form.elements = ground;

        if (isDetail) {
          delete page.form.button;
        }

        if (isUpdate) {
          page.form.button.mutation.id = groundId;
        }
      }
    }
    console.log('page', page.state.form.elements);
    return page;
  }
}

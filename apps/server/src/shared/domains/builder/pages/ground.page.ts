import { Injectable } from '@nestjs/common';
import { PageBuilder, SectionBuilder } from '@shared/types';
import { FormBuilderService } from '../form/form-builder.service';
import { InputBuilderService } from '../Input/Input-builder.service';
import { CreateGroundDto } from '../../../dtos';
import { ContextProvider } from '../../../providers/context.provider';
import { ButtonBuilderService } from '../button/button-builder.service';
import { GroundsRepository } from '../../../repositories';

@Injectable()
export class GroundPage {
  constructor(
    private readonly formBuilderService: FormBuilderService,
    private readonly inputBuilderService: InputBuilderService,
    private readonly buttonBuilderService: ButtonBuilderService,
    private readonly groundsRepository: GroundsRepository,
  ) {}

  private getDefaultCDO(): CreateGroundDto {
    return {
      imageDepotId: '',
      workspaceId: '',
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

  private buildForm(sections: SectionBuilder[], isUpdate: boolean) {
    const button = this.buttonBuilderService.build({
      name: isUpdate ? '수정' : '생성',
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
    });

    return this.formBuilderService.build({
      sections,
      button,
    });
  }

  async build(groundId: string | 'new', type: 'add' | 'edit' | 'detail'): Promise<PageBuilder> {
    const isUpdate = groundId !== 'new' && type === 'edit';
    const isDetail = type === 'detail';

    const inputs = this.inputBuilderService.build([
      'name',
      'label',
      'phone',
      'email',
      'address',
      'businessNo',
    ]);

    const groundDepotIdInput = this.inputBuilderService.getDepotUploaderInput({
      path: 'form.inputs.imageDepotId',
      type: 'image',
      label: '그라운드 이미지',
    });

    const logoDepotIdInput = this.inputBuilderService.getDepotUploaderInput({
      path: 'form.inputs.logoDepotId',
      type: 'image',
      label: '로고 이미지',
    });

    const sections = this.buildSections(inputs);
    sections[0].stacks.push({
      type: 'HStack',
      inputs: [groundDepotIdInput, logoDepotIdInput],
    });

    const form = this.buildForm(sections, isUpdate);

    const page: PageBuilder = {
      name: '그라운드',
      form,
      state: {
        form: {
          inputs: this.getDefaultCDO(),
        },
      },
    };

    if (isDetail || isUpdate) {
      const ground = await this.groundsRepository.findUnique({ where: { id: groundId } });
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

    return page;
  }
}

import { Injectable } from '@nestjs/common';
import { PageBuilder, SectionBuilder } from '@shared/types';
import { FormBuilderService } from '../form/form-builder.service';
import { InputBuilderService } from '../Input/Input-builder.service';
import { CreateGymDto } from '../../../dtos';
import { ContextProvider } from '../../../providers/context.provider';
import { ButtonBuilderService } from '../button/button-builder.service';
import { GymsRepository } from '../../../repositories';

@Injectable()
export class GymPage {
  constructor(
    private readonly formBuilderService: FormBuilderService,
    private readonly inputBuilderService: InputBuilderService,
    private readonly buttonBuilderService: ButtonBuilderService,
    private readonly gymsRepository: GymsRepository,
  ) { }

  private getDefaultCDO(): CreateGymDto {
    return {
      name: '',
      label: '',
      businessNo: '',
      address: '',
      phone: '',
      email: '',
      depotId: '',
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
        invalidationKey: '/api/v1/gyms',
        name: isUpdate ? 'updateGym' : 'createGym',
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

  async build(gymId: string | 'new', type: 'add' | 'edit' | 'detail'): Promise<PageBuilder> {
    const isUpdate = gymId !== 'new' && type === 'edit';
    const isDetail = type === 'detail';

    const inputs = this.inputBuilderService.build(['name', 'label', 'phone', 'email', 'address', 'businessNo']);
    const sections = this.buildSections(inputs);
    const form = this.buildForm(sections, isUpdate);

    const page: PageBuilder = {
      name: '헬스장',
      form,
      state: {
        form: {
          inputs: this.getDefaultCDO(),
        },
      },
    };

    if (isDetail || isUpdate) {
      const gym = await this.gymsRepository.findUnique({ where: { id: gymId } });
      if (gym) {
        page.state.form.inputs = gym;

        if (isDetail) {
          delete page.form.button;
        }

        if (isUpdate) {
          page.form.button.mutation.id = gymId;
        }
      }
    }

    return page;
  }
}

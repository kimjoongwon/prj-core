import { Injectable } from '@nestjs/common';
import { PageBuilder, SectionBuilder } from '@shared/types';
import { PrismaService } from 'nestjs-prisma';
import { FormBuilderService } from '../form/form-builder.service';
import { InputBuilderService } from '../Input/Input-builder.service';
import { CreateGroupDto } from '../../../dtos';
import { ContextProvider } from '../../../providers/context.provider';
import { ButtonBuilderService } from '../button/button-builder.service';

@Injectable()
export class GroupPage {
  constructor(
    private readonly prisma: PrismaService,
    private readonly formBuilderService: FormBuilderService,
    private readonly inputBuilderService: InputBuilderService,
    private readonly buttonBuilderSerivce: ButtonBuilderService,
  ) {}

  private getDefaultCDO(): CreateGroupDto {
    return {
      name: '',
      label: undefined,
      serviceId: ContextProvider.getServiceId(),
      tenantId: ContextProvider.getTenantId(),
    };
  }

  private async getGroupData(groupId: string): Promise<CreateGroupDto | null> {
    return this.prisma.group.findUnique({
      where: { id: groupId },
    });
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
    const button = this.buttonBuilderSerivce.build({
      name: isUpdate ? '수정' : '생성',
      mutation: {
        invalidationKey: '/api/v1/groups',
        name: isUpdate ? 'updateGroup' : 'createGroup',
        params: {
          serviceId: ContextProvider.getServiceId(),
          tenantId: ContextProvider.getTenantId(),
        },
      },
      toast: {
        title: '성공',
        description: isUpdate ? '그룹이 수정되었습니다.' : '그룹이 생성되었습니다.',
      },
    });

    return this.formBuilderService.build({
      sections,
      button,
    });
  }

  async build(groupId: string | 'new', type: 'add' | 'edit' | 'detail'): Promise<PageBuilder> {
    const isUpdate = groupId !== 'new' && type === 'edit';
    const isDetail = type === 'detail';

    const inputs = this.inputBuilderService.build(['name', 'label']);
    const sections = this.buildSections(inputs);
    const form = this.buildForm(sections, isUpdate);

    const page: PageBuilder = {
      name: '그룹',
      form,
      state: {
        form: {
          inputs: this.getDefaultCDO(),
        },
      },
    };

    if (isDetail) {
      const group = await this.getGroupData(groupId);
      if (group) {
        page.state.form.inputs = group;
        delete page.form.button;
      }
    }

    if (isUpdate) {
      const group = await this.getGroupData(groupId);
      if (group) {
        page.state.form.inputs = group;
        page.form.button.mutation.id = groupId;
      }
    }

    console.log('page', page);

    return page;
  }
}

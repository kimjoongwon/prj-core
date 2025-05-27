import { Injectable } from '@nestjs/common';
import { ButtonBuilder, PageBuilder, SectionBuilder } from '@shared/types';
import { PrismaService } from 'nestjs-prisma';
import { FormBuilderService } from '../form/form-builder.service';
import { InputBuilderService } from '../Input/Input-builder.service';
import { ButtonBuilderService } from '../button/button-builder.service';
import { CreateGroupDto } from '../../../../shared/dto';
import { ContextProvider } from '../../../../shared/provider/context.provider';

type PageType = 'create' | 'modify' | 'detail' | 'add';

@Injectable()
export class GroupPage {
  constructor(
    private readonly prisma: PrismaService,
    private readonly formBuilderService: FormBuilderService,
    private readonly inputBuilderService: InputBuilderService,
    private readonly buttonBuilderService: ButtonBuilderService,
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

  private createButton(type: PageType, groupId: string): ButtonBuilder | undefined {
    if (type === 'detail') return undefined;

    const buttonType = type === 'modify' ? 'modify' : 'create';
    return this.buttonBuilderService.buildFormButton({
      type: buttonType,
      resourceName: 'Group',
      resourceLabel: '그룹',
      id: type === 'modify' ? groupId : undefined,
    });
  }

  async build(groupId: string, type: PageType): Promise<PageBuilder> {
    const inputs = this.inputBuilderService.build(['name', 'label']);
    const sections = this.buildSections(inputs);
    const button = this.createButton(type, groupId);
    let formInputs = this.getDefaultCDO();

    // 데이터 조회
    if (type === 'modify' || type === 'detail') {
      const group = await this.getGroupData(groupId);
      if (group) {
        formInputs = group;
      }
    }

    const form = this.formBuilderService.build({
      id: groupId,
      type,
      resourceName: 'Group',
      resourceLabel: '그룹',
      button,
      sections: sections,
    });

    return {
      name: '그룹',
      form,
      state: {
        form: {
          inputs: formInputs,
          button: {
            errorMessages: [],
          },
        },
      },
    };
  }
}

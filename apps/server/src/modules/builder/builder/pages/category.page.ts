import { SectionBuilder } from '@shared/types';
import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { ContextProvider, CreateCategoryDto } from '@shared';
import { FormBuilderService } from '../form/form-builder.service';
import { InputBuilderService } from '../Input/Input-builder.service';
import { ButtonBuilderService } from '../button/button-builder.service';
import { ResourceConfigService } from '../services/resource-config.service';
import { BasePageBuilder } from './base-page.builder';
import { PageType } from '../types/page.types';

@Injectable()
export class CategoryPage extends BasePageBuilder<CreateCategoryDto, any> {
  constructor(
    private readonly prisma: PrismaService,
    formBuilderService: FormBuilderService,
    inputBuilderService: InputBuilderService,
    buttonBuilderService: ButtonBuilderService,
    resourceConfigService: ResourceConfigService,
  ) {
    super(formBuilderService, inputBuilderService, buttonBuilderService, resourceConfigService);
  }

  protected getResourceName(): string {
    return 'Category';
  }

  protected getDefaultDto(): CreateCategoryDto {
    return {
      name: '',
      parentId: undefined,
      serviceId: ContextProvider.getServiceId(),
      tenantId: ContextProvider.getTenantId(),
      type: 'ROOT',
    };
  }

  protected buildInputs(): any[] {
    return this.inputBuilderService.build(['name']);
  }

  protected buildSections(inputs: any[]): SectionBuilder[] {
    return [
      {
        name: '기본 정보',
        stacks: [
          {
            type: 'VStack' as const,
            inputs,
          },
        ],
      },
    ];
  }

  protected async loadEntity(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  protected handleCreateLogic(
    formInputs: CreateCategoryDto,
    categoryId: string,
    type: PageType,
  ): CreateCategoryDto {
    if (type === 'create' || type === 'add') {
      formInputs.type = type === 'create' ? 'ROOT' : 'LEAF';
      formInputs.parentId = categoryId;
    }
    return formInputs;
  }
}

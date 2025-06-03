
// import { ButtonBuilder, PageBuilder, SectionBuilder } from '@shared/types';
// import { FormBuilderService } from '../form/form-builder.service';
// import { ElementBuilderService } from '../Input/Input-builder.service';
// import { ButtonBuilderService } from '../button/button-builder.service';
// import { ResourceConfigService } from '../services/resource-config.service';
// import { PageType, PageBuilderOptions } from '../types/page.types';

// export abstract class BasePageBuilder<TDto = any, TEntity = any> {
//   constructor(
//     protected readonly formBuilderService: FormBuilderService,
//     protected readonly elementBuilderService: ElementBuilderService,
//     protected readonly buttonBuilderService: ButtonBuilderService,
//     protected readonly resourceConfigService?: ResourceConfigService,
//   ) {}

//   protected abstract getResourceName(): string;
//   protected abstract getDefaultDto(): TDto;
//   protected abstract buildInputs(): any[];
//   protected abstract buildSections(elements: any[]): SectionBuilder[];
//   protected abstract loadEntity(id: string): Promise<TEntity | null>;

//   // 기본 버튼 생성 (오버라이드 가능)
//   protected createButton(type: PageType, id: string): ButtonBuilder | undefined {
//     if (type === 'detail') return undefined;

//     if (!this.resourceConfigService) {
//       // ResourceConfigService가 없는 경우 직접 처리
//       return this.createCustomButton(type, id);
//     }

//     const resourceConfig = this.resourceConfigService.getConfig(this.getResourceName());
//     const buttonType = type === 'modify' ? 'modify' : 'create';

//     return this.buttonBuilderService.buildFormButton({
//       type: buttonType,
//       resourceName: resourceConfig.name,
//       resourceLabel: resourceConfig.label,
//       id: type === 'modify' ? id : undefined,
//       payloadPath: (type === 'create' || type === 'add') ? 'form.elements' : undefined,
//     });
//   }

//   // 커스텀 버튼 생성을 위한 메서드 (오버라이드 가능)
//   protected createCustomButton(type: PageType, id: string): ButtonBuilder | undefined {
//     return undefined;
//   }

//   protected buildForm(options: PageBuilderOptions<TDto>): any {
//     const { type, id, resourceConfig } = options;
//     const sections = this.buildSections(this.buildInputs());
//     const button = this.createButton(type, id);

//     return this.formBuilderService.build({
//       id,
//       type,
//       resourceName: resourceConfig?.name || this.getResourceName(),
//       resourceLabel: resourceConfig?.label || this.getResourceName(),
//       button,
//       sections,
//     });
//   }

//   async build(id: string, type: PageType): Promise<PageBuilder> {
//     const resourceConfig = this.resourceConfigService?.getConfig(this.getResourceName());
//     let formInputs = this.getDefaultDto();
    
//     // Load existing data for modify/detail
//     if (type === 'modify' || type === 'detail') {
//       const entity = await this.loadEntity(id);
//       if (entity) {
//         formInputs = entity as any;
//       }
//     }

//     // Handle create/add specific logic
//     if (type === 'create' || type === 'add') {
//       formInputs = this.handleCreateLogic(formInputs, id, type);
//     }

//     const form = this.buildForm({
//       id,
//       type,
//       defaultData: formInputs,
//       resourceConfig,
//     });

//     return {
//       name: resourceConfig?.label || this.getResourceName(),
//       state: { form: { elements: formInputs } },
//       form,
//     };
//   }

//   protected handleCreateLogic(formInputs: TDto, id: string, type: PageType): TDto {
//     // Override in child classes if needed
//     return formInputs;
//   }
// }

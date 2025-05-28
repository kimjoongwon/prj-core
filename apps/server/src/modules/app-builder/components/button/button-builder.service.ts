import { Injectable } from '@nestjs/common';
import { ButtonBuilder } from '@shared/types';
import { ContextProvider } from '../../../../shared/provider/context.provider';
import { ResourceConfigService } from '../services/resource-config.service';

@Injectable()
export class ButtonBuilderService {
  constructor(private readonly resourceConfigService: ResourceConfigService) {}
  build({ name, mutation }: ButtonBuilder): ButtonBuilder {
    return {
      name,
      mutation,
      toast: {
        title: '성공',
        description: '성공적으로 처리되었습니다.',
      },
      navigator: {
        type: 'back',
      },
    };
  }

  buildFormButton(options: {
    type: 'create' | 'modify';
    resourceName: string;
    resourceLabel?: string;
    id?: string;
    payloadPath?: string;
    params?: Record<string, any>;
  }): ButtonBuilder {
    const { type, resourceName, resourceLabel, id, payloadPath, params } = options;
    
    const isUpdate = type === 'modify';
    const mutationName = isUpdate ? `update${resourceName}` : `create${resourceName}`;
    const buttonName = isUpdate ? '수정' : '생성';
    
    // Use ResourceConfigService to get consistent invalidation key
    let invalidationKey: string;
    try {
      const resourceConfig = this.resourceConfigService.getConfig(resourceName);
      invalidationKey = resourceConfig.invalidationKey;
    } catch {
      // Fallback to old pattern if not configured
      invalidationKey = `/api/v1/${resourceName.toLowerCase()}s`;
    }
    
    const label = resourceLabel || resourceName;
    const toastDescription = isUpdate
      ? `${label}가 수정되었습니다.`
      : `${label}가 생성되었습니다.`;

    const mutation: any = {
      name: mutationName,
      invalidationKey,
      params: {
        parentId: undefined,
        serviceId: ContextProvider.getServiceId(),
        tenantId: ContextProvider.getTenantId(),
        ...params,
      },
    };

    if (id) mutation.id = id;
    if (payloadPath) mutation.payloadPath = payloadPath;

    return this.build({
      name: buttonName,
      mutation,
      toast: {
        title: '성공',
        description: toastDescription,
      },
    });
  }
}

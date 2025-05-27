import { Injectable } from '@nestjs/common';
import {
  BuilderOptions,
  ButtonBuilder,
  FormBuilder,
  InputBuilder,
  SectionBuilder,
} from '@shared/types';
import _ from 'lodash';

type ButtonMode = '생성' | '수정';

type Options = {
  sections: SectionBuilder[];
  button: ButtonBuilder;
};

// 리소스별 라벨 매핑
const ResourceLabels: Record<string, string> = {
  Category: '카테고리',
  Group: '그룹',
  Role: '역할',
};

@Injectable()
export class FormBuilderService {
  buttonMode: ButtonMode;
  inputs: InputBuilder[];

  /**
   * @deprecated Use ButtonBuilderService.buildFormButton instead
   */
  getButtonConfig(options: {
    isUpdate: boolean;
    resourceName: string;
    serviceId: string;
    tenantId: string;
    mutationId?: string;
    payloadPath?: string;
    params?: Record<string, any>;
  }): ButtonBuilder {
    const { isUpdate, resourceName, serviceId, tenantId, mutationId, payloadPath, params } =
      options;

    const mutationName = isUpdate ? `update${resourceName}` : `create${resourceName}`;
    const buttonName = isUpdate ? '수정' : '생성';
    const resourceLabel = ResourceLabels[resourceName] || resourceName;
    const toastDescription = isUpdate
      ? `${resourceLabel}가 수정되었습니다.`
      : `${resourceLabel}가 생성되었습니다.`;

    const mutation: any = {
      name: mutationName,
      invalidationKey: `/api/v1/${resourceName.toLowerCase()}s`,
      params: {
        parentId: undefined,
        serviceId,
        tenantId,
        ...params,
      },
    };
    if (mutationId) mutation.id = mutationId;
    if (payloadPath) mutation.payloadPath = payloadPath;

    return {
      name: buttonName,
      mutation,
      navigator: { type: 'back' },
      toast: {
        title: '성공',
        description: toastDescription,
      },
    };
  }

  build({
    id,
    type,
    sections,
    button,
    resourceName = 'Category',
    resourceLabel,
  }: BuilderOptions & { resourceName?: string; resourceLabel?: string }): FormBuilder {
    const isCreate = type === 'create';
    const isDetail = type === 'detail';
    const isModify = id !== 'new' && type === 'modify';

    // 버튼 mutation 이름 수정
    if (button?.mutation) {
      if (isModify) {
        button.mutation.name = `update${resourceName}`;
      } else if (isCreate) {
        button.mutation.name = `create${resourceName}`;
      }
    }

    // 버튼 이름 결정
    if (button) {
      button.name = isModify ? '수정' : '생성';
    }

    // 폼 이름 결정
    const formName = (() => {
      let baseName = '편집';

      if (isModify) {
        baseName = '수정';
      } else if (isCreate) {
        baseName = '추가';
      } else if (isDetail) {
        baseName = '상세';
      }

      // resourceLabel이 제공되면 사용하고, 없으면 매핑된 라벨을 찾거나 기본값으로 resourceName 사용
      const label = resourceLabel || ResourceLabels[resourceName] || resourceName;
      return `${label} ${baseName}`;
    })();

    return {
      name: formName,
      button,
      sections,
    };
  }
  // 이제 외부에서 리소스 이름과 라벨을 직접 받기 때문에 별도의 매핑 메소드가 필요 없습니다.
}

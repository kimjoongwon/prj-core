import { Injectable } from '@nestjs/common';
import { ContextProvider } from '../../../providers';
import { isDisabled } from 'effect/RuntimeFlagsPatch';

type FieldTypes = 'name' | 'label';
@Injectable()
export class InputBuilderService {
  label: string;

  setLabel(label: string) {
    this.label = label;
  }

  build(fieldTypes: FieldTypes[]) {
    const inputs = [];
    if (fieldTypes.includes('name')) {
      inputs.push(this.getNameInput());
    }
    if (fieldTypes.includes('label')) {
      inputs.push(this.getLabelInput());
    }
    return inputs;
  }

  getNameInput() {
    const pageContext = ContextProvider.getPageContext();

    return {
      type: 'Input',
      path: 'form.inputs.name',
      props: {
        isDisabled: pageContext === 'detail' ? true : false,
        fullWidth: true,
        label: '이름',
        placeholder: '이름을 입력해주세요.',
      },
    };
  }

  getLabelInput() {
    const pageContext = ContextProvider.getPageContext();
    return {
      type: 'Input',
      path: 'form.inputs.label',
      props: {
        isDisabled: pageContext === 'detail' ? true : false,
        fullWidth: true,
        label: '라벨',
        placeholder: '라벨을 입력해주세요.',
      },
    };
  }
}

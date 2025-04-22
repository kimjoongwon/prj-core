import { Injectable } from '@nestjs/common';
import { ContextProvider } from '../../../providers';
import { DepotUploaderOptions, InputBuilder } from '@shared/types';
import { defaultsDeep } from 'lodash';

type FieldTypes = 'name' | 'label' | 'businessNo' | 'address' | 'phone' | 'email';

@Injectable()
export class InputBuilderService {
  label: string;
  pathBase: string = 'form.inputs';

  setLabel(label: string) {
    this.label = label;
  }

  setPathBase(pathBase: string) {
    this.pathBase = pathBase;
  }

  build(fieldTypes: FieldTypes[], pathBase?: string) {
    if (pathBase) {
      this.setPathBase(pathBase);
    }
    const inputs = fieldTypes.map((fieldType) => this.getInputByFieldType(fieldType));
    return inputs.filter((input) => input !== null);
  }

  private getInputByFieldType(fieldType: FieldTypes) {
    const inputHandlers: Record<FieldTypes, () => any> = {
      name: this.getNameInput.bind(this),
      label: this.getLabelInput.bind(this),
      businessNo: this.getBusinessNoInput.bind(this),
      address: this.getAddressInput.bind(this),
      phone: this.getPhoneInput.bind(this),
      email: this.getEmailInput.bind(this),
    };

    return inputHandlers[fieldType] ? inputHandlers[fieldType]() : null;
  }

  getDepotUploaderInput(options: DepotUploaderOptions) {
    return {
      type: 'DepotUploader',
      path: options.path,
      props: {
        type: options.type,
        label: options?.label,
      },
    };
  }

  private getNameInput() {
    return this.createInput({
      path: 'name',
      placeholder: '그라운드명을 입력해주세요.',
      label: '그라운드명',
    });
  }

  private getLabelInput() {
    return this.createInput({ path: 'label', label: '라벨', placeholder: '라벨을 입력해주세요.' });
  }

  private getBusinessNoInput() {
    return this.createInput({
      path: 'businessNo',
      label: '사업자 번호',
      placeholder: '사업자 번호를 입력해주세요.',
    });
  }

  private getAddressInput() {
    return this.createInput({
      path: 'address',
      label: '주소',
      placeholder: '주소를 입력해주세요.',
    });
  }

  private getPhoneInput() {
    return this.createInput({
      path: 'phone',
      label: '전화번호',
      placeholder: '전화번호를 입력해주세요.',
    });
  }

  private getEmailInput() {
    return this.createInput({
      path: 'email',
      label: '이메일',
      placeholder: '이메일을 입력해주세요.',
      options: {
        validation: {
          timings: ['onBlur'],
          required: {
            value: true,
            message: '이메일을 입력해주세요.',
          },
          patterns: [
            {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: '이메일 형식이 아닙니다.',
            },
          ],
        },
      },
    });
  }

  createInput({
    path,
    placeholder,
    label,
    options,
  }: {
    path: string;
    placeholder?: string;
    label?: string;
    options?: InputBuilder;
  }) {
    const pageContext = ContextProvider.getPageContext();
    const _inputBuilder: InputBuilder = {
      type: 'Input',
      path: this.pathBase + '.' + path,
      props: {
        isDisabled: pageContext === 'detail',
        fullWidth: true,
        label,
        placeholder,
      },
      validation: {
        timings: ['onBlur'],
        required: {
          value: true,
          message: `${label}을 입력해주세요.`,
        },
      },
    };

    const inputBuilder = defaultsDeep(_inputBuilder, options);

    return inputBuilder;
  }
}

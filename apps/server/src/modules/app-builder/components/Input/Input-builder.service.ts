import { Injectable } from '@nestjs/common';
import { ContextProvider } from '../../../../shared/provider';
import { DepotUploaderOptions, ElementBuilder } from '@shared/specs';
import { defaultsDeep } from 'lodash';

type FieldTypes = 'name' | 'label' | 'businessNo' | 'address' | 'phone' | 'email' | 'password';

@Injectable()
export class ElementBuilderService {
  label: string;
  pathBase: string = 'form.elements';

  setLabel(label: string) {
    this.label = label;
  }

  setPathBase(pathBase: string) {
    this.pathBase = pathBase;
  }

  build(fieldTypes: FieldTypes[], pathBase?: string) {
    if (pathBase) {
      this.setPathBase(pathBase);
    } else {
      this.setPathBase('form.elements');
    }
    const elements = fieldTypes.map((fieldType) => this.getInputByFieldType(fieldType));
    return elements.filter((input) => input !== null);
  }

  private getInputByFieldType(fieldType: FieldTypes) {
    const inputHandlers: Record<FieldTypes, () => any> = {
      name: this.getNameInput.bind(this),
      label: this.getLabelInput.bind(this),
      businessNo: this.getBusinessNoInput.bind(this),
      address: this.getAddressInput.bind(this),
      phone: this.getPhoneInput.bind(this),
      email: this.getEmailInput.bind(this),
      password: this.getPasswordInput.bind(this),
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
      label: '이름',
    });
  }

  private getLabelInput() {
    return this.createInput({ path: 'label', label: '라벨', placeholder: '라벨을 입력해주세요.' });
  }

  private getBusinessNoInput() {
    return this.createInput({
      path: 'businessNo',
      label: '사업자 번호',
    });
  }

  private getAddressInput() {
    return this.createInput({
      path: 'address',
      label: '주소',
    });
  }

  private getPhoneInput() {
    return this.createInput({
      path: 'phone',
      label: '전화번호',
      options: {
        validation: {
          timings: ['onBlur'],
          required: {
            value: true,
            message: '전화번호을 입력해주세요.',
          },
          patterns: [
            {
              value: /^\d{3}-\d{3,4}-\d{4}$/,
              message: '전화번호 형식이 아닙니다.',
            },
          ],
        },
      },
    });
  }

  private getEmailInput() {
    return this.createInput({
      path: 'email',
      label: '이메일',
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

  private getPasswordInput() {
    return this.createInput({
      path: 'password',
      label: '비밀번호',
      placeholder: '비밀번호를 입력해주세요.',
      options: {
        props: {
          type: 'password',
        },
        validation: {
          timings: ['onBlur'],
          required: {
            value: true,
            message: '비밀번호를 입력해주세요.',
          },
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
    options?: ElementBuilder;
  }) {
    const pageContext = ContextProvider.getPageContext();
    const _elementBuilder: ElementBuilder = {
      name: 'Input',
      path: this.pathBase + '.' + path,
      props: {
        isDisabled: pageContext === 'detail',
        fullWidth: true,
        label,
        placeholder,
        isRequired: true,
      },
      validation: {
        timings: ['onBlur'],
        required: {
          value: true,
          message: `${label}을 입력해주세요.`,
        },
      },
    };

    const elementBuilder = defaultsDeep(_elementBuilder, options);

    return elementBuilder;
  }
}

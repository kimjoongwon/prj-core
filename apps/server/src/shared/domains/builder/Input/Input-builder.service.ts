import { Injectable } from '@nestjs/common';
import { ContextProvider } from '../../../providers';
import { DepotUploaderOptions } from '@shared/types';

type FieldTypes = 'name' | 'label' | 'businessNo' | 'address' | 'phone' | 'email';

@Injectable()
export class InputBuilderService {
  label: string;

  setLabel(label: string) {
    this.label = label;
  }

  build(fieldTypes: FieldTypes[]) {
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
    return this.createInput('form.inputs.name', '이름', '이름을 입력해주세요.');
  }

  private getLabelInput() {
    return this.createInput('form.inputs.label', '라벨', '라벨을 입력해주세요.');
  }

  private getBusinessNoInput() {
    return this.createInput('form.inputs.businessNo', '사업자 번호', '사업자 번호를 입력해주세요.');
  }

  private getAddressInput() {
    return this.createInput('form.inputs.address', '주소', '주소를 입력해주세요.');
  }

  private getPhoneInput() {
    return this.createInput('form.inputs.phone', '전화번호', '전화번호를 입력해주세요.');
  }

  private getEmailInput() {
    return this.createInput('form.inputs.email', '이메일', '이메일을 입력해주세요.');
  }

  private createInput(path: string, label: string, placeholder: string) {
    const pageContext = ContextProvider.getPageContext();
    return {
      type: 'Input',
      path,
      props: {
        isDisabled: pageContext === 'detail',
        fullWidth: true,
        label,
        placeholder,
      },
    };
  }
}

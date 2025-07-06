import { getGroundPage } from './ground.page';
import { PageTypes } from '@shared/types';

describe('GroundPage', () => {
  describe('페이지 기본 구성', () => {
    it('create 타입: 그라운드 생성 페이지를 올바르게 구성해야 한다', () => {
      const result = getGroundPage('create');

      expect(result.name).toBe('그라운드 생성');
      expect(result.state.form.inputs).toEqual({
        name: '',
        label: '',
        phone: '',
        email: '',
        address: '',
        businessNo: '',
        logoImageFileId: '',
        imageFileId: '',
        spaceId: '',
      });
    });

    it('modify 타입: 그라운드 수정 페이지를 올바르게 구성해야 한다', () => {
      const result = getGroundPage('modify');

      expect(result.name).toBe('그라운드 수정');
      expect(result.state.form.inputs).toBeDefined();
    });

    it('detail 타입: 그라운드 상세 페이지를 올바르게 구성해야 한다', () => {
      const result = getGroundPage('detail');

      expect(result.name).toBe('그라운드 상세');
      expect(result.state.form.inputs).toBeDefined();
    });
  });

  describe('현재 구조 테스트', () => {
    it('elements 구조를 가져야 한다', () => {
      const result = getGroundPage('create');

      expect(result.elements).toBeDefined();
      expect(result.elements).toHaveLength(1);
      expect(result.elements[0].name).toBe('ResourceBuilder');
      expect(result.elements[0].props.elements).toBeDefined();
    });

    it('ResourceBuilder를 포함해야 한다', () => {
      const result = getGroundPage('create');

      const resourceBuilder = result.elements[0];
      expect(resourceBuilder.name).toBe('ResourceBuilder');
      expect(resourceBuilder.props.resourceName).toBe('ground');
    });

    it('Form과 Input 요소들을 포함해야 한다', () => {
      const result = getGroundPage('create');

      const resourceBuilder = result.elements[0];
      const formElement = resourceBuilder.props.elements[0].children[0];
      
      expect(formElement.name).toBe('Form');
      expect(formElement.children).toBeDefined();
      expect(Array.isArray(formElement.children)).toBe(true);
    });

    it('FileUploader 요소들을 포함해야 한다', () => {
      const result = getGroundPage('create');

      const resourceBuilder = result.elements[0];
      const formElement = resourceBuilder.props.elements[0].children[0];
      const hStackElement = formElement.children[1];
      
      expect(hStackElement.name).toBe('HStack');
      expect(hStackElement.children).toHaveLength(2);
      expect(hStackElement.children[0].name).toBe('FileUploader');
      expect(hStackElement.children[1].name).toBe('FileUploader');
    });
  });

  describe('Mutation 설정', () => {
    it('create 타입: createGround mutation을 설정해야 한다', () => {
      const result = getGroundPage('create');

      const resourceBuilder = result.elements[0];
      const formElement = resourceBuilder.props.elements[0].children[0];
      const buttonElement = formElement.children[2];
      
      expect(buttonElement.name).toBe('ButtonBuilder');
      expect(buttonElement.props.mutation.name).toBe('createGround');
      expect(buttonElement.props.mutation.queryKey).toBe('/api/v1/grounds');
    });

    it('modify 타입: updateGroundById mutation을 설정해야 한다', () => {
      const result = getGroundPage('modify');

      const resourceBuilder = result.elements[0];
      const formElement = resourceBuilder.props.elements[0].children[0];
      const buttonElement = formElement.children[2];
      
      expect(buttonElement.name).toBe('ButtonBuilder');
      expect(buttonElement.props.mutation.name).toBe('updateGroundById');
      expect(buttonElement.props.mutation.pathParams.groundId).toBe('params.groundId');
    });

    it('detail 타입: mutation이 없어야 한다', () => {
      const result = getGroundPage('detail');

      const resourceBuilder = result.elements[0];
      const formElement = resourceBuilder.props.elements[0].children[0];
      
      // detail 모드에서는 버튼이 없어야 함
      expect(formElement.children).toHaveLength(2);
      expect(formElement.children[2]).toBeUndefined();
    });
  });

  describe('Validation 규칙', () => {
    it('name과 label 필드가 필수로 설정되어야 한다', () => {
      const result = getGroundPage('create');

      const resourceBuilder = result.elements[0];
      const formElement = resourceBuilder.props.elements[0].children[0];
      const buttonElement = formElement.children[2];
      const validation = buttonElement.props.mutation.validationFields;
      
      expect(validation['form.inputs.name'].required.value).toBe(true);
      expect(validation['form.inputs.label'].required.value).toBe(true);
    });

    it('email 필드에 올바른 패턴 검증이 설정되어야 한다', () => {
      const result = getGroundPage('create');

      const resourceBuilder = result.elements[0];
      const formElement = resourceBuilder.props.elements[0].children[0];
      const buttonElement = formElement.children[2];
      const validation = buttonElement.props.mutation.validationFields;
      
      expect(validation['form.inputs.email'].patterns).toBeDefined();
      expect(validation['form.inputs.email'].patterns[0].value).toBeInstanceOf(RegExp);
    });
  });

  describe('readonly 설정', () => {
    it('detail 타입에서는 모든 입력 필드가 readonly여야 한다', () => {
      const result = getGroundPage('detail');

      const resourceBuilder = result.elements[0];
      const formElement = resourceBuilder.props.elements[0].children[0];
      const vStackElement = formElement.children[0];
      
      vStackElement.children.forEach((element: any) => {
        if (element.name === 'Input') {
          expect(element.props.isReadOnly).toBe(true);
        }
      });
    });

    it('create/modify 타입에서는 입력 필드가 편집 가능해야 한다', () => {
      const createResult = getGroundPage('create');
      const modifyResult = getGroundPage('modify');

      [createResult, modifyResult].forEach((result) => {
        const resourceBuilder = result.elements[0];
        const formElement = resourceBuilder.props.elements[0].children[0];
        const vStackElement = formElement.children[0];
        
        vStackElement.children.forEach((element: any) => {
          if (element.name === 'Input') {
            expect(element.props.isReadOnly).toBe(false);
          }
        });
      });
    });
  });
});

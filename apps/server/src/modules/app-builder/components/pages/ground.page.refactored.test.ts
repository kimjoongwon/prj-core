import { getGroundPage } from './ground.page';
import { PageType } from '../types/page.types';

describe('GroundPage - ElementBuilder 구조', () => {
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

  describe('ElementBuilder 구조 (리팩토링 후)', () => {
    it('elements 배열 구조를 가져야 한다', () => {
      const result = getGroundPage('create');

      expect(result.elements).toBeDefined();
      expect(result.elements).toHaveLength(1);
      expect(result.sections).toBeUndefined(); // sections는 더 이상 사용하지 않음
    });

    it('ResourceBuilder를 포함해야 한다', () => {
      const result = getGroundPage('create');

      const resourceBuilder = result.elements[0];
      expect(resourceBuilder.name).toBe('ResourceBuilder');
      expect(resourceBuilder.props.resourceName).toBe('ground');
      expect(resourceBuilder.props.elements).toBeDefined(); // sections 대신 elements 사용
      expect(resourceBuilder.props.sections).toBeUndefined();
    });

    it('VStack > Form > VStack + HStack 구조를 가져야 한다', () => {
      const result = getGroundPage('create');

      const resourceBuilder = result.elements[0];
      const vStackElement = resourceBuilder.props.elements[0];
      
      expect(vStackElement.name).toBe('VStack');
      expect(vStackElement.props.className).toBe('space-y-4');
      
      const formElement = vStackElement.children[0];
      expect(formElement.name).toBe('Form');
      expect(formElement.children).toBeDefined();
      expect(Array.isArray(formElement.children)).toBe(true);
      expect(formElement.children).toHaveLength(3); // VStack + HStack + Button
    });

    it('Form 내부에 Input 요소들을 포함해야 한다', () => {
      const result = getGroundPage('create');

      const resourceBuilder = result.elements[0];
      const vStackElement = resourceBuilder.props.elements[0];
      const formElement = vStackElement.children[0];
      const inputVStackElement = formElement.children[0];
      
      expect(inputVStackElement.name).toBe('VStack');
      expect(inputVStackElement.children).toBeDefined();
      expect(inputVStackElement.children.length).toBeGreaterThan(0);
      
      // 첫 번째 입력 필드가 Input인지 확인
      const firstInput = inputVStackElement.children[0];
      expect(firstInput.name).toBe('Input');
      expect(firstInput.props.label).toBe('이름');
      expect(firstInput.props.path).toBe('form.inputs.name');
    });

    it('FileUploader 요소들을 포함해야 한다', () => {
      const result = getGroundPage('create');

      const resourceBuilder = result.elements[0];
      const vStackElement = resourceBuilder.props.elements[0];
      const formElement = vStackElement.children[0];
      const hStackElement = formElement.children[1];
      
      expect(hStackElement.name).toBe('HStack');
      expect(hStackElement.children).toHaveLength(2);
      expect(hStackElement.children[0].name).toBe('FileUploader');
      expect(hStackElement.children[0].props.label).toBe('로고 이미지 파일 ID');
      expect(hStackElement.children[1].name).toBe('FileUploader');
      expect(hStackElement.children[1].props.label).toBe('이미지 파일 ID');
    });

    it('create/modify 모드에서 ButtonBuilder를 포함해야 한다', () => {
      const createResult = getGroundPage('create');
      const modifyResult = getGroundPage('modify');

      [createResult, modifyResult].forEach((result) => {
        const resourceBuilder = result.elements[0];
        const vStackElement = resourceBuilder.props.elements[0];
        const formElement = vStackElement.children[0];
        const buttonElement = formElement.children[2];
        
        expect(buttonElement.name).toBe('ButtonBuilder');
        expect(buttonElement.props.mutation).toBeDefined();
      });
    });

    it('detail 모드에서는 ButtonBuilder가 없어야 한다', () => {
      const result = getGroundPage('detail');

      const resourceBuilder = result.elements[0];
      const vStackElement = resourceBuilder.props.elements[0];
      const formElement = vStackElement.children[0];
      
      // detail 모드에서는 버튼이 없어야 함 (children이 2개: VStack + HStack)
      expect(formElement.children).toHaveLength(2);
    });
  });

  describe('Mutation 설정', () => {
    it('create 타입: createGround mutation을 설정해야 한다', () => {
      const result = getGroundPage('create');

      const resourceBuilder = result.elements[0];
      const vStackElement = resourceBuilder.props.elements[0];
      const formElement = vStackElement.children[0];
      const buttonElement = formElement.children[2];
      
      expect(buttonElement.name).toBe('ButtonBuilder');
      expect(buttonElement.props.mutation.name).toBe('createGround');
      expect(buttonElement.props.mutation.queryKey).toBe('/api/v1/grounds');
    });

    it('modify 타입: updateGroundById mutation을 설정해야 한다', () => {
      const result = getGroundPage('modify');

      const resourceBuilder = result.elements[0];
      const vStackElement = resourceBuilder.props.elements[0];
      const formElement = vStackElement.children[0];
      const buttonElement = formElement.children[2];
      
      expect(buttonElement.name).toBe('ButtonBuilder');
      expect(buttonElement.props.mutation.name).toBe('updateGroundById');
      expect(buttonElement.props.mutation.pathParams.groundId).toBe('params.groundId');
    });
  });

  describe('Validation 규칙', () => {
    it('name과 label 필드가 필수로 설정되어야 한다', () => {
      const result = getGroundPage('create');

      const resourceBuilder = result.elements[0];
      const vStackElement = resourceBuilder.props.elements[0];
      const formElement = vStackElement.children[0];
      const buttonElement = formElement.children[2];
      const validation = buttonElement.props.mutation.validationFields;
      
      expect(validation['form.inputs.name'].required.value).toBe(true);
      expect(validation['form.inputs.label'].required.value).toBe(true);
    });

    it('email 필드에 올바른 패턴 검증이 설정되어야 한다', () => {
      const result = getGroundPage('create');

      const resourceBuilder = result.elements[0];
      const vStackElement = resourceBuilder.props.elements[0];
      const formElement = vStackElement.children[0];
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
      const vStackElement = resourceBuilder.props.elements[0];
      const formElement = vStackElement.children[0];
      const inputVStackElement = formElement.children[0];
      
      inputVStackElement.children.forEach((element: any) => {
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
        const vStackElement = resourceBuilder.props.elements[0];
        const formElement = vStackElement.children[0];
        const inputVStackElement = formElement.children[0];
        
        inputVStackElement.children.forEach((element: any) => {
          if (element.name === 'Input') {
            expect(element.props.isReadOnly).toBe(false);
          }
        });
      });
    });
  });

  describe('구조 단순화 검증', () => {
    it('sections/stacks 중첩이 제거되어야 한다', () => {
      const result = getGroundPage('create');

      // 이전: sections[0].stacks[0].elements[0] (3단계 중첩)
      // 이후: elements[0] (1단계)
      expect(result.elements).toBeDefined();
      expect(result.sections).toBeUndefined();
      
      const resourceBuilder = result.elements[0];
      expect(resourceBuilder.props.elements).toBeDefined();
      expect(resourceBuilder.props.sections).toBeUndefined();
    });

    it('VStack과 HStack이 일반 컴포넌트로 처리되어야 한다', () => {
      const result = getGroundPage('create');

      const resourceBuilder = result.elements[0];
      const vStackElement = resourceBuilder.props.elements[0];
      
      expect(vStackElement.name).toBe('VStack');
      expect(vStackElement.props).toBeDefined();
      expect(vStackElement.children).toBeDefined();
      
      const formElement = vStackElement.children[0];
      const hStackElement = formElement.children[1];
      
      expect(hStackElement.name).toBe('HStack');
      expect(hStackElement.children).toBeDefined();
    });
  });
});

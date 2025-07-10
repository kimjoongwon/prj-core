import type { $Enums } from '@prisma/client';
import { getCategoryPage } from './category.page';

// Mock ContextProvider
jest.mock('../../../../shared', () => ({
  ContextProvider: {
    getTenantId: jest.fn(() => 'test-tenant-id'),
  },
}));

describe('CategoryPage', () => {
  const spaceType: $Enums.CategoryTypes = 'Space';
  const userType: $Enums.CategoryTypes = 'User';

  describe('페이지 기본 구성', () => {
    it('create 타입: 카테고리 생성 페이지를 올바르게 구성해야 한다', () => {
      const result = getCategoryPage('create', spaceType);

      expect(result.state.form.inputs).toEqual({
        name: '',
        type: 'Space',
        parentId: null,
        tenantId: 'test-tenant-id',
      });
    });

    it('modify 타입: 카테고리 수정 페이지를 올바르게 구성해야 한다', () => {
      const result = getCategoryPage('modify', spaceType);

      expect(result.state.form.inputs.type).toBe('Space');
    });

    it('detail 타입: 카테고리 상세 페이지를 올바르게 구성해야 한다', () => {
      const result = getCategoryPage('detail', spaceType);

      expect(result.state.form.inputs.type).toBe('Space');
    });

    it('add 타입: 카테고리 추가 페이지를 올바르게 구성해야 한다', () => {
      const result = getCategoryPage('add', spaceType);

      expect(result.state.form.inputs.type).toBe('Space');
    });
  });

  describe('페이지 제목 설정', () => {
    it('create 타입일 때 올바른 제목을 가져야 한다', () => {
      const result = getCategoryPage('create', spaceType);
      const titleElement = result.elements[0].props.elements[0].children[0];

      expect(titleElement.props.children).toBe('카테고리 생성');
    });

    it('modify 타입일 때 올바른 제목을 가져야 한다', () => {
      const result = getCategoryPage('modify', spaceType);
      const titleElement = result.elements[0].props.elements[0].children[0];

      expect(titleElement.props.children).toBe('카테고리 수정');
    });

    it('detail 타입일 때 올바른 제목을 가져야 한다', () => {
      const result = getCategoryPage('detail', spaceType);
      const titleElement = result.elements[0].props.elements[0].children[0];

      expect(titleElement.props.children).toBe('카테고리 상세');
    });

    it('add 타입일 때 올바른 제목을 가져야 한다', () => {
      const result = getCategoryPage('add', spaceType);
      const titleElement = result.elements[0].props.elements[0].children[0];

      expect(titleElement.props.children).toBe('카테고리 생성');
    });
  });

  describe('ResourceBuilder 설정', () => {
    it('올바른 ResourceBuilder 설정을 가져야 한다', () => {
      const result = getCategoryPage('create', spaceType);
      const resourceBuilder = result.elements[0];

      expect(resourceBuilder.name).toBe('ResourceBuilder');
      expect(resourceBuilder.props.resourceName).toBe('category');
      expect(resourceBuilder.props.type).toBe('resource');
      expect(resourceBuilder.props.query.name).toBe('useGetCategoryById');
    });

    it('VStack 구조를 포함해야 한다', () => {
      const result = getCategoryPage('create', spaceType);
      const vstack = result.elements[0].props.elements[0];

      expect(vstack.name).toBe('VStack');
      expect(vstack.props.className).toBe('space-y-4');
      expect(vstack.children).toBeDefined();
    });
  });

  describe('Input 필드 설정', () => {
    it('이름 입력 필드가 올바르게 설정되어야 한다', () => {
      const result = getCategoryPage('create', spaceType);
      const inputElement = result.elements[0].props.elements[0].children[1];

      expect(inputElement.name).toBe('Input');
      expect(inputElement.props.label).toBe('이름');
      expect(inputElement.props.path).toBe('form.inputs.name');
      expect(inputElement.props.isReadOnly).toBe(false);
    });

    it('detail 타입일 때 Input이 읽기 전용이어야 한다', () => {
      const result = getCategoryPage('detail', spaceType);
      const inputElement = result.elements[0].props.elements[0].children[1];

      expect(inputElement.props.isReadOnly).toBe(true);
    });

    it('create 타입일 때 Input이 편집 가능해야 한다', () => {
      const result = getCategoryPage('create', spaceType);
      const inputElement = result.elements[0].props.elements[0].children[1];

      expect(inputElement.props.isReadOnly).toBe(false);
    });
  });

  describe('버튼 구성', () => {
    it('create 타입일 때 생성 버튼을 포함해야 한다', () => {
      const result = getCategoryPage('create', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const button = vstack.children.find((child) => child.name === 'ButtonBuilder');

      expect(button).toBeDefined();
      expect(button.props.children).toBe('생성');
      expect(button.props.color).toBe('primary');
      expect(button.props.mutation.name).toBe('createCategory');
    });

    it('add 타입일 때 추가 버튼을 포함해야 한다', () => {
      const result = getCategoryPage('add', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const button = vstack.children.find((child) => child.name === 'ButtonBuilder');

      expect(button).toBeDefined();
      expect(button.props.children).toBe('추가');
      expect(button.props.mutation.name).toBe('createCategory');
    });

    it('modify 타입일 때 수정 버튼을 포함해야 한다', () => {
      const result = getCategoryPage('modify', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const button = vstack.children.find((child) => child.name === 'ButtonBuilder');

      expect(button).toBeDefined();
      expect(button.props.children).toBe('수정');
      expect(button.props.color).toBe('primary');
      expect(button.props.mutation.name).toBe('updateCategoryById');
    });

    it('detail 타입일 때 버튼이 없어야 한다', () => {
      const result = getCategoryPage('detail', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const button = vstack.children.find((child) => child.name === 'ButtonBuilder');

      expect(button).toBeUndefined();
    });
  });

  describe('Validation 설정', () => {
    it('create/add 버튼에 올바른 validation이 설정되어야 한다', () => {
      const result = getCategoryPage('create', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const button = vstack.children.find((child) => child.name === 'ButtonBuilder');

      expect(button.props.mutation.validationFields['form.inputs.name'].required).toEqual({
        value: true,
        message: '카테고리 이름은 필수입니다',
      });
    });

    it('modify 버튼에 올바른 validation과 pathParams가 설정되어야 한다', () => {
      const result = getCategoryPage('modify', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const button = vstack.children.find((child) => child.name === 'ButtonBuilder');

      expect(button.props.mutation.validationFields['form.inputs.name'].required).toEqual({
        value: true,
        message: '카테고리 이름은 필수입니다',
      });
      expect(button.props.mutation.pathParams.categoryId).toBe('categoryId');
    });
  });

  describe('Navigation 설정', () => {
    it('버튼에 back 네비게이션이 설정되어야 한다', () => {
      const result = getCategoryPage('create', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const button = vstack.children.find((child) => child.name === 'ButtonBuilder');

      expect(button.props.navigator.type).toBe('back');
    });
  });

  describe('카테고리 타입별 처리', () => {
    it('User 타입 카테고리를 올바르게 처리해야 한다', () => {
      const result = getCategoryPage('create', userType);

      expect(result.state.form.inputs.type).toBe('User');
    });

    it('Space 타입 카테고리를 올바르게 처리해야 한다', () => {
      const result = getCategoryPage('create', spaceType);

      expect(result.state.form.inputs.type).toBe('Space');
    });
  });

  describe('Spacer 설정', () => {
    it('Spacer가 올바른 크기로 설정되어야 한다', () => {
      const result = getCategoryPage('create', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const spacer = vstack.children.find((child) => child.name === 'Spacer');

      expect(spacer).toBeDefined();
      expect(spacer.props.size).toBe(4);
    });
  });

  describe('ContextProvider 연동', () => {
    it('테넌트 ID가 올바르게 설정되어야 한다', () => {
      const result = getCategoryPage('create', spaceType);

      expect(result.state.form.inputs.tenantId).toBe('test-tenant-id');
    });
  });
});

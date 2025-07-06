import { getGroupPage } from './group.page';
import { $Enums } from '@prisma/client';

// Mock ContextProvider
jest.mock('../../../../shared', () => ({
  ContextProvider: {
    getTenantId: jest.fn().mockReturnValue('test-tenant-id'),
  },
}));

describe('GroupPage', () => {
  const spaceType: $Enums.GroupTypes = 'Space';
  const userType: $Enums.GroupTypes = 'User';

  describe('페이지 기본 구성', () => {
    it('create 타입: 그룹 생성 페이지를 올바르게 구성해야 한다', () => {
      const result = getGroupPage('create', spaceType);

      expect(result.state.form.inputs).toEqual({
        name: '',
        label: '',
        type: 'Space',
        tenantId: 'test-tenant-id',
      });
    });

    it('modify 타입: 그룹 수정 페이지를 올바르게 구성해야 한다', () => {
      const result = getGroupPage('modify', spaceType);

      expect(result.state.form.inputs.type).toBe('Space');
    });

    it('detail 타입: 그룹 상세 페이지를 올바르게 구성해야 한다', () => {
      const result = getGroupPage('detail', spaceType);

      expect(result.state.form.inputs.type).toBe('Space');
    });
  });

  describe('페이지 제목 설정', () => {
    it('create 타입일 때 올바른 제목을 가져야 한다', () => {
      const result = getGroupPage('create', spaceType);
      const titleElement = result.elements[0].props.elements[0].children[0];

      expect(titleElement.props.children).toBe('그룹 생성');
    });

    it('modify 타입일 때 올바른 제목을 가져야 한다', () => {
      const result = getGroupPage('modify', spaceType);
      const titleElement = result.elements[0].props.elements[0].children[0];

      expect(titleElement.props.children).toBe('그룹 수정');
    });

    it('detail 타입일 때 올바른 제목을 가져야 한다', () => {
      const result = getGroupPage('detail', spaceType);
      const titleElement = result.elements[0].props.elements[0].children[0];

      expect(titleElement.props.children).toBe('그룹 상세');
    });

    it('add 타입일 때 올바른 제목을 가져야 한다', () => {
      const result = getGroupPage('add', spaceType);
      const titleElement = result.elements[0].props.elements[0].children[0];

      expect(titleElement.props.children).toBe('그룹 생성');
    });
  });

  describe('ResourceBuilder 설정', () => {
    it('올바른 ResourceBuilder 설정을 가져야 한다', () => {
      const result = getGroupPage('create', spaceType);
      const resourceBuilder = result.elements[0];

      expect(resourceBuilder.name).toBe('ResourceBuilder');
      expect(resourceBuilder.props.resourceName).toBe('group');
      expect(resourceBuilder.props.type).toBe('resource');
      expect(resourceBuilder.props.query.name).toBe('useGetGroupById');
    });

    it('VStack 구조를 포함해야 한다', () => {
      const result = getGroupPage('create', spaceType);
      const vstack = result.elements[0].props.elements[0];

      expect(vstack.name).toBe('VStack');
      expect(vstack.props.className).toBe('space-y-4');
      expect(vstack.children).toBeDefined();
    });
  });

  describe('Input 필드 설정', () => {
    it('이름 입력 필드가 올바르게 설정되어야 한다', () => {
      const result = getGroupPage('create', spaceType);
      const nameInput = result.elements[0].props.elements[0].children[1];

      expect(nameInput.name).toBe('Input');
      expect(nameInput.props.label).toBe('이름');
      expect(nameInput.props.path).toBe('form.inputs.name');
      expect(nameInput.props.isReadOnly).toBe(false);
    });

    it('라벨 입력 필드가 올바르게 설정되어야 한다', () => {
      const result = getGroupPage('create', spaceType);
      const labelInput = result.elements[0].props.elements[0].children[2];

      expect(labelInput.name).toBe('Input');
      expect(labelInput.props.label).toBe('라벨');
      expect(labelInput.props.path).toBe('form.inputs.label');
      expect(labelInput.props.isReadOnly).toBe(false);
    });

    it('detail 타입일 때 Input들이 읽기 전용이어야 한다', () => {
      const result = getGroupPage('detail', spaceType);
      const nameInput = result.elements[0].props.elements[0].children[1];
      const labelInput = result.elements[0].props.elements[0].children[2];

      expect(nameInput.props.isReadOnly).toBe(true);
      expect(labelInput.props.isReadOnly).toBe(true);
    });

    it('create 타입일 때 Input들이 편집 가능해야 한다', () => {
      const result = getGroupPage('create', spaceType);
      const nameInput = result.elements[0].props.elements[0].children[1];
      const labelInput = result.elements[0].props.elements[0].children[2];

      expect(nameInput.props.isReadOnly).toBe(false);
      expect(labelInput.props.isReadOnly).toBe(false);
    });
  });

  describe('버튼 구성', () => {
    it('create 타입일 때 생성 버튼을 포함해야 한다', () => {
      const result = getGroupPage('create', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const button = vstack.children.find(child => child.name === 'ButtonBuilder');

      expect(button).toBeDefined();
      expect(button.props.children).toBe('생성');
      expect(button.props.color).toBe('primary');
      expect(button.props.mutation.name).toBe('createGroup');
    });

    it('add 타입일 때 생성 버튼을 포함해야 한다', () => {
      const result = getGroupPage('add', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const button = vstack.children.find(child => child.name === 'ButtonBuilder');

      expect(button).toBeDefined();
      expect(button.props.children).toBe('생성');
      expect(button.props.mutation.name).toBe('createGroup');
    });

    it('modify 타입일 때 수정 버튼을 포함해야 한다', () => {
      const result = getGroupPage('modify', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const button = vstack.children.find(child => child.name === 'ButtonBuilder');

      expect(button).toBeDefined();
      expect(button.props.children).toBe('수정');
      expect(button.props.color).toBe('primary');
      expect(button.props.mutation.name).toBe('updateGroupById');
    });

    it('detail 타입일 때 버튼이 없어야 한다', () => {
      const result = getGroupPage('detail', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const button = vstack.children.find(child => child.name === 'ButtonBuilder');

      expect(button).toBeUndefined();
    });
  });

  describe('Validation 설정', () => {
    it('create/add 버튼에 올바른 validation이 설정되어야 한다', () => {
      const result = getGroupPage('create', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const button = vstack.children.find(child => child.name === 'ButtonBuilder');

      expect(button.props.mutation.validationFields['form.inputs.name'].required).toEqual({
        value: true,
        message: '그룹 이름은 필수입니다',
      });

      expect(button.props.mutation.validationFields['form.inputs.label'].required).toEqual({
        value: true,
        message: '그룹 라벨은 필수입니다',
      });
    });

    it('modify 버튼에 올바른 validation과 pathParams가 설정되어야 한다', () => {
      const result = getGroupPage('modify', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const button = vstack.children.find(child => child.name === 'ButtonBuilder');

      expect(button.props.mutation.validationFields['form.inputs.name'].required).toEqual({
        value: true,
        message: '그룹 이름은 필수입니다',
      });

      expect(button.props.mutation.validationFields['form.inputs.label'].required).toEqual({
        value: true,
        message: '그룹 라벨은 필수입니다',
      });

      expect(button.props.mutation.pathParams.groupId).toBe('groupId');
    });
  });

  describe('Navigation 설정', () => {
    it('버튼에 back 네비게이션이 설정되어야 한다', () => {
      const result = getGroupPage('create', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const button = vstack.children.find(child => child.name === 'ButtonBuilder');

      expect(button.props.navigator.type).toBe('back');
    });
  });

  describe('그룹 타입별 처리', () => {
    it('User 타입 그룹을 올바르게 처리해야 한다', () => {
      const result = getGroupPage('create', userType);

      expect(result.state.form.inputs.type).toBe('User');
    });

    it('Space 타입 그룹을 올바르게 처리해야 한다', () => {
      const result = getGroupPage('create', spaceType);

      expect(result.state.form.inputs.type).toBe('Space');
    });
  });

  describe('Spacer 설정', () => {
    it('Spacer가 올바른 크기로 설정되어야 한다', () => {
      const result = getGroupPage('create', spaceType);
      const vstack = result.elements[0].props.elements[0];
      const spacer = vstack.children.find(child => child.name === 'Spacer');

      expect(spacer).toBeDefined();
      expect(spacer.props.size).toBe(4);
    });
  });

  describe('ContextProvider 연동', () => {
    it('테넌트 ID가 올바르게 설정되어야 한다', () => {
      const result = getGroupPage('create', spaceType);

      expect(result.state.form.inputs.tenantId).toBe('test-tenant-id');
    });
  });

  describe('폼 입력 기본값', () => {
    it('기본 입력값이 올바르게 설정되어야 한다', () => {
      const result = getGroupPage('create', spaceType);

      expect(result.state.form.inputs.name).toBe('');
      expect(result.state.form.inputs.label).toBe('');
    });
  });
});

import { getTenantSelectPage } from './tenant-select.page';

describe('TenantSelectPage', () => {
  describe('페이지 기본 구성', () => {
    it('테넌트 선택 페이지를 올바르게 구성해야 한다', () => {
      const result = getTenantSelectPage();

      expect(result.name).toBe('그라운드 선택');
      expect(result.state).toEqual({
        selectedTenantId: '',
      });
    });

    it('elements 구조를 가져야 한다', () => {
      const result = getTenantSelectPage();

      expect(result.elements).toBeDefined();
      expect(result.elements).toHaveLength(1);
      expect(result.elements[0].name).toBe('VStack');
    });

    it('VStack 내부에 필요한 컴포넌트들을 포함해야 한다', () => {
      const result = getTenantSelectPage();
      const vstack = result.elements[0];

      expect(vstack.children).toBeDefined();
      expect(vstack.children).toHaveLength(4);

      const [logo, title, listbox, button] = vstack.children;

      // Logo 컴포넌트
      expect(logo.name).toBe('Logo');

      // 제목 텍스트
      expect(title.name).toBe('Text');
      expect(title.props.children).toBe('그라운드 선택');
      expect(title.props.variant).toBe('h1');

      // ListboxBuilder
      expect(listbox.name).toBe('ListboxBuilder');
      expect(listbox.props.title).toBe('그라운드 선택');
      expect(listbox.props.path).toBe('selectedTenantId');

      // ButtonBuilder
      expect(button.name).toBe('ButtonBuilder');
      expect(button.props.children).toBe('선택');
      expect(button.props.color).toBe('primary');
    });
  });

  describe('ListboxBuilder 설정', () => {
    it('올바른 쿼리 설정을 가져야 한다', () => {
      const result = getTenantSelectPage();
      const listbox = result.elements[0].children[2];

      expect(listbox.props.query.type).toBe('list');
      expect(listbox.props.query.query.name).toBe('useGetTenantsByQuery');
      expect(listbox.props.query.listOptions.valueField).toBe('id');
      expect(listbox.props.query.listOptions.labelField).toBe('space.ground.name');
      expect(listbox.props.selectionMode).toBe('single');
    });
  });

  describe('ButtonBuilder 설정', () => {
    it('올바른 mutation 설정을 가져야 한다', () => {
      const result = getTenantSelectPage();
      const button = result.elements[0].children[3];

      expect(button.props.mutation.name).toBe('selectTenant');
      expect(button.props.mutation.data.selectedTenantId).toBe('selectedTenantId');
    });

    it('올바른 validation 설정을 가져야 한다', () => {
      const result = getTenantSelectPage();
      const button = result.elements[0].children[3];

      expect(button.props.mutation.validationFields.selectedTenantId.required).toEqual({
        value: true,
        message: '그라운드를 선택해주세요.',
      });
    });

    it('올바른 navigator 설정을 가져야 한다', () => {
      const result = getTenantSelectPage();
      const button = result.elements[0].children[3];

      expect(button.props.navigator.type).toBe('push');
      expect(button.props.navigator.route.fullPath).toBe('/admin/dashboard');
    });
  });

  describe('스타일링 설정', () => {
    it('VStack에 올바른 className을 가져야 한다', () => {
      const result = getTenantSelectPage();
      const vstack = result.elements[0];

      expect(vstack.props.className).toBe('space-y-6 max-w-md mx-auto mt-16');
    });

    it('제목에 올바른 className을 가져야 한다', () => {
      const result = getTenantSelectPage();
      const title = result.elements[0].children[1];

      expect(title.props.className).toBe('text-center text-2xl font-bold mb-6');
    });

    it('버튼에 올바른 className을 가져야 한다', () => {
      const result = getTenantSelectPage();
      const button = result.elements[0].children[3];

      expect(button.props.className).toBe('w-full');
    });
  });
});

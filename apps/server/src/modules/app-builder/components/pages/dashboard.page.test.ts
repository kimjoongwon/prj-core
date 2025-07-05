import { getDashboardPage } from './dashboard.page';

describe('DashboardPage', () => {
  describe('페이지 기본 구성', () => {
    it('대시보드 페이지를 올바르게 구성해야 한다', () => {
      const result = getDashboardPage();

      expect(result.name).toBe('대시보드');
      expect(result.elements).toBeDefined();
      expect(result.elements).toHaveLength(1);
    });

    it('elements 구조를 가져야 한다', () => {
      const result = getDashboardPage();

      expect(result.elements[0].name).toBe('VStack');
      expect(result.elements[0].props.className).toBe('space-y-4');
    });

    it('VStack 내부에 필요한 컴포넌트들을 포함해야 한다', () => {
      const result = getDashboardPage();
      const vstack = result.elements[0];

      expect(vstack.children).toBeDefined();
      expect(vstack.children).toHaveLength(5);

      const [spacer1, welcomeText, spacer2, descriptionText, spacer3] = vstack.children;

      // 첫 번째 Spacer
      expect(spacer1.name).toBe('Spacer');
      expect(spacer1.props.size).toBe('4');

      // 환영 메시지
      expect(welcomeText.name).toBe('Text');
      expect(welcomeText.props.children).toBe('대시보드에 오신 것을 환영합니다!');
      expect(welcomeText.props.variant).toBe('h1');

      // 두 번째 Spacer
      expect(spacer2.name).toBe('Spacer');
      expect(spacer2.props.size).toBe('2');

      // 설명 텍스트
      expect(descriptionText.name).toBe('Text');
      expect(descriptionText.props.children).toBe('워크스페이스가 성공적으로 선택되었습니다.');
      expect(descriptionText.props.variant).toBe('body1');

      // 세 번째 Spacer
      expect(spacer3.name).toBe('Spacer');
      expect(spacer3.props.size).toBe('4');
    });
  });

  describe('텍스트 컴포넌트 설정', () => {
    it('환영 메시지가 올바르게 설정되어야 한다', () => {
      const result = getDashboardPage();
      const welcomeText = result.elements[0].children[1];

      expect(welcomeText.props.children).toBe('대시보드에 오신 것을 환영합니다!');
      expect(welcomeText.props.variant).toBe('h1');
      expect(welcomeText.props.className).toBe('text-center text-2xl font-bold text-gray-800');
    });

    it('설명 텍스트가 올바르게 설정되어야 한다', () => {
      const result = getDashboardPage();
      const descriptionText = result.elements[0].children[3];

      expect(descriptionText.props.children).toBe('워크스페이스가 성공적으로 선택되었습니다.');
      expect(descriptionText.props.variant).toBe('body1');
      expect(descriptionText.props.className).toBe('text-center text-gray-600');
    });
  });

  describe('Spacer 컴포넌트 설정', () => {
    it('모든 Spacer가 올바른 크기를 가져야 한다', () => {
      const result = getDashboardPage();
      const spacers = result.elements[0].children.filter(child => child.name === 'Spacer');

      expect(spacers).toHaveLength(3);
      expect(spacers[0].props.size).toBe('4');
      expect(spacers[1].props.size).toBe('2');
      expect(spacers[2].props.size).toBe('4');
    });
  });

  describe('스타일링 설정', () => {
    it('VStack에 올바른 className을 가져야 한다', () => {
      const result = getDashboardPage();
      const vstack = result.elements[0];

      expect(vstack.props.className).toBe('space-y-4');
    });
  });

  describe('페이지 구조 검증', () => {
    it('페이지 상태(state)가 정의되지 않아도 문제없어야 한다', () => {
      const result = getDashboardPage();

      expect(result.state).toBeUndefined();
    });

    it('elements 기반 구조를 사용해야 한다', () => {
      const result = getDashboardPage();

      expect(result.elements).toBeDefined();
      expect(result.sections).toBeUndefined();
    });
  });
});

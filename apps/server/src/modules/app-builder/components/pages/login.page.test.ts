import { getLoginPage } from './login.page';

describe('LoginPage', () => {
  describe('페이지 기본 구성', () => {
    it('로그인 페이지를 올바르게 구성해야 한다', () => {
      const result = getLoginPage();

      expect(result.name).toBe('로그인');
      expect(result.state.form.inputs).toEqual({
        email: 'plate@gmail.com',
        password: 'rkdmf12!@',
      });
    });

    it('elements 구조를 가져야 한다', () => {
      const result = getLoginPage();

      expect(result.elements).toBeDefined();
      expect(result.elements).toHaveLength(1);
      expect(result.elements[0].name).toBe('VStack');
    });

    it('VStack 내부에 필요한 컴포넌트들을 포함해야 한다', () => {
      const result = getLoginPage();
      const vstack = result.elements[0];

      expect(vstack.children).toBeDefined();
      expect(vstack.children).toHaveLength(7);

      const [logo, spacer1, title, emailInput, passwordInput, spacer2, button] = vstack.children;

      // Logo 컴포넌트
      expect(logo.name).toBe('Logo');

      // 첫 번째 Spacer
      expect(spacer1.name).toBe('Spacer');
      expect(spacer1.props.size).toBe('4');

      // 제목 텍스트
      expect(title.name).toBe('Text');
      expect(title.props.children).toBe('로그인');
      expect(title.props.variant).toBe('h1');

      // 이메일 입력
      expect(emailInput.name).toBe('Input');
      expect(emailInput.props.label).toBe('이메일');
      expect(emailInput.props.type).toBe('email');

      // 비밀번호 입력
      expect(passwordInput.name).toBe('Input');
      expect(passwordInput.props.label).toBe('비밀번호');
      expect(passwordInput.props.type).toBe('password');

      // 두 번째 Spacer
      expect(spacer2.name).toBe('Spacer');
      expect(spacer2.props.size).toBe('2');

      // 로그인 버튼
      expect(button.name).toBe('ButtonBuilder');
      expect(button.props.children).toBe('로그인');
    });
  });

  describe('입력 필드 설정', () => {
    it('이메일 입력 필드가 올바르게 설정되어야 한다', () => {
      const result = getLoginPage();
      const emailInput = result.elements[0].children[3];

      expect(emailInput.props.label).toBe('이메일');
      expect(emailInput.props.path).toBe('form.inputs.email');
      expect(emailInput.props.type).toBe('email');
      expect(emailInput.props.variant).toBe('bordered');
    });

    it('비밀번호 입력 필드가 올바르게 설정되어야 한다', () => {
      const result = getLoginPage();
      const passwordInput = result.elements[0].children[4];

      expect(passwordInput.props.label).toBe('비밀번호');
      expect(passwordInput.props.path).toBe('form.inputs.password');
      expect(passwordInput.props.type).toBe('password');
      expect(passwordInput.props.variant).toBe('bordered');
    });
  });

  describe('ButtonBuilder 설정', () => {
    it('올바른 기본 속성을 가져야 한다', () => {
      const result = getLoginPage();
      const button = result.elements[0].children[6];

      expect(button.props.children).toBe('로그인');
      expect(button.props.color).toBe('primary');
      expect(button.props.size).toBe('lg');
      expect(button.props.variant).toBe('solid');
      expect(button.props.className).toBe('w-full');
    });

    it('올바른 mutation 설정을 가져야 한다', () => {
      const result = getLoginPage();
      const button = result.elements[0].children[6];

      expect(button.props.mutation.name).toBe('getToken');
    });

    it('이메일 validation 설정이 올바르게 되어야 한다', () => {
      const result = getLoginPage();
      const button = result.elements[0].children[6];
      const emailValidation = button.props.mutation.validationFields['form.inputs.email'];

      expect(emailValidation.required).toEqual({
        value: true,
        message: '이메일은 필수입니다',
      });

      expect(emailValidation.patterns).toHaveLength(1);
      expect(emailValidation.patterns[0].value).toEqual(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(emailValidation.patterns[0].message).toBe('올바른 이메일 형식이 아닙니다');
    });

    it('비밀번호 validation 설정이 올바르게 되어야 한다', () => {
      const result = getLoginPage();
      const button = result.elements[0].children[6];
      const passwordValidation = button.props.mutation.validationFields['form.inputs.password'];

      expect(passwordValidation.required).toEqual({
        value: true,
        message: '비밀번호는 필수입니다',
      });

      expect(passwordValidation.minLength).toEqual({
        value: 6,
        message: '비밀번호는 최소 6자 이상이어야 합니다',
      });
    });

    it('올바른 navigator 설정을 가져야 한다', () => {
      const result = getLoginPage();
      const button = result.elements[0].children[6];

      expect(button.props.navigator.type).toBe('push');
      expect(button.props.navigator.route.fullPath).toBe('/admin/tenant-select');
    });
  });

  describe('스타일링 설정', () => {
    it('VStack에 올바른 className을 가져야 한다', () => {
      const result = getLoginPage();
      const vstack = result.elements[0];

      expect(vstack.props.className).toBe('space-y-4 max-w-md mx-auto mt-16');
    });

    it('제목에 올바른 className을 가져야 한다', () => {
      const result = getLoginPage();
      const title = result.elements[0].children[2];

      expect(title.props.className).toBe('text-center text-2xl font-bold mb-6');
    });
  });

  describe('기본값 설정', () => {
    it('기본 이메일과 비밀번호가 설정되어야 한다', () => {
      const result = getLoginPage();

      expect(result.state.form.inputs.email).toBe('plate@gmail.com');
      expect(result.state.form.inputs.password).toBe('rkdmf12!@');
    });
  });
});

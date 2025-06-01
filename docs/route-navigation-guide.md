# 라우트 메타데이터 기반 네비게이션 가이드

> **⚠️ 중요:** 이 문서는 새로운 `UnifiedNavigationService`를 기준으로 업데이트되었습니다. 
> 기존 `NavigationService`와 `RouteNavigator`에서 마이그레이션하는 경우 [마이그레이션 가이드](./navigation-migration-guide.md)를 참조하세요.

## 개요

이 문서는 라우트 메타데이터를 기반으로 네비게이션 시스템을 사용하는 방법을 설명합니다. 새로운 `UnifiedNavigationService`를 통해 라우트의 이름을 키로 사용하여 직접적이고 유연한 네비게이션이 가능하며, 조건에 따른 경로 이동을 구현할 수 있습니다.

## 0. UnifiedNavigationService 소개

### 주요 기능
- **라우트 관리**: RouteBuilder에서 Route 객체 생성 및 관리
- **이름 기반 네비게이션**: 라우트 이름으로 직접 네비게이션
- **조건부 라우팅**: 조건에 따른 동적 경로 결정
- **활성 상태 추적**: 현재 활성화된 라우트 자동 추적
- **브레드크럼 생성**: 현재 경로의 브레드크럼 자동 생성
- **타입 안전성**: 완전한 TypeScript 지원

### 기본 사용법

```typescript
import { UnifiedNavigationService, unifiedNavigationService } from '@shared/frontend';
import { rawRoutes } from '@shared/specs';

// 새 인스턴스 생성
const navigation = new UnifiedNavigationService(rawRoutes);

// 또는 글로벌 싱글톤 사용
unifiedNavigationService.setRoutes(rawRoutes);
```

## 1. 라우트 네비게이션 훅 사용하기

`useRouteNavigator` 훅을 이용해 라우트 이름으로 네비게이션할 수 있습니다.

```tsx
import { useRouteNavigator } from '@shared/frontend';

const MyComponent = () => {
  const { navigateByName, navigateByCondition } = useRouteNavigator();

  const handleLogin = () => {
    // "로그인" 이름을 가진 라우트로 이동
    navigateByName('로그인');
  };

  const handleSubmit = (isValid) => {
    // 조건에 따라 다른 라우트로 이동
    navigateByCondition(isValid, '성공', '실패');
  };

  return (
    <div>
      <button onClick={handleLogin}>로그인 페이지로</button>
      <button onClick={() => handleSubmit(true)}>제출하기</button>
    </div>
  );
};
```

## 2. 네비게이션 컴포넌트 사용하기

### 라우트 이름으로 이동하는 버튼

```tsx
import { RouteNavigationButton } from '@shared/frontend';

const MyComponent = () => {
  return (
    <div>
      <RouteNavigationButton 
        routeName="로그인" 
        color="primary"
      >
        로그인 페이지로
      </RouteNavigationButton>
    </div>
  );
};
```

### 조건에 따라 다른 라우트로 이동하는 버튼

```tsx
import { ConditionalNavigationButton } from '@shared/frontend';

const MyComponent = () => {
  const isLoggedIn = useUserAuth().isLoggedIn;

  return (
    <div>
      <ConditionalNavigationButton
        condition={isLoggedIn}
        routeNameIfTrue="대시보드"
        routeNameIfFalse="로그인"
        color="primary"
      >
        서비스 시작하기
      </ConditionalNavigationButton>
    </div>
  );
};
```

## 3. 라우트 시각화 사용하기

```tsx
import { RouteVisualizer } from '@shared/frontend';

const RoutesPage = () => {
  return (
    <div className="h-[800px]">
      <RouteVisualizer />
    </div>
  );
};
```

## 4. 실제 응용 사례

### 권한에 따른 라우팅

```tsx
// 사용자 권한에 따라 다른 페이지로 이동
const handleAccessArea = () => {
  navigateByCondition(
    userHasPermission('admin'),
    '관리자_대시보드', 
    '접근_거부'
  );
};
```

### 조건 충족 여부에 따른 라우팅

```tsx
// 폼 검증 후 결과에 따라 다른 페이지로 이동
const handleFormSubmit = async (data) => {
  const validationResult = await validateForm(data);
  
  navigateByCondition(
    validationResult.isValid,
    '결제_페이지', 
    '폼_오류'
  );
};
```

### 다단계 프로세스에서의 라우팅

```tsx
// 다단계 프로세스에서 조건에 따라 다음 단계 결정
const proceedToNextStep = (currentStep, stepData) => {
  if (currentStep === 'verification') {
    const verified = verifyData(stepData);
    
    navigateByCondition(
      verified,
      '최종_확인', 
      '정보_수정'
    );
  }
};
```

## 5. 시각화 도구 활용 사례

### 관리자용 라우트 모니터링

- 전체 애플리케이션 라우트 구조 파악
- 중첩된 라우트 관계 시각적으로 확인
- 새로운 기능 개발 시 기존 라우트 구조 참조

### 개발 도구로 활용

- 라우트 구조 디버깅 및 분석
- 새로운 라우트 설계 시 참고 자료
- 문서화 도구로 활용

## 주의사항

1. 라우트 이름은 고유해야 합니다. 중복된 이름이 있을 경우 첫 번째로 찾은 라우트를 사용합니다.
2. 잘못된 라우트 이름을 사용하면 콘솔에 오류가 출력되고 네비게이션이 실패합니다.
3. 라우트 시각화 도구는 성능을 위해 큰 규모의 라우트 구조에서는 사용을 제한해야 할 수 있습니다.

## 확장 가능성

- 라우트 접근 권한 관리와 연동
- 라우트 방문 기록 추적 및 분석
- 사용자 행동 패턴 분석 기능 추가
- 동적 라우트 생성 및 관리

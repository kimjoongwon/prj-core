# ElementBuilder Debug Guide

ElementBuilder 컴포넌트의 디버깅을 위한 가이드입니다.

## 🔧 디버깅 기능

### 1. 자동 로깅 (개발 환경)

개발 환경에서 ElementBuilder는 자동으로 다음 정보를 콘솔에 출력합니다:

- 컴포넌트 렌더링 정보
- 사용 가능한 컴포넌트 목록
- 컴포넌트 트리 구조
- 렌더링 성능 측정
- props 변경 감지
- 생명주기 추적

### 2. 에러 시각화

컴포넌트를 찾을 수 없는 경우, 빨간색 박스로 에러 정보를 표시합니다:

- 누락된 컴포넌트 이름
- 사용 가능한 컴포넌트 목록
- 접을 수 있는 상세 정보

### 3. 개발자 도구 통합

브라우저 개발자 도구에서 다음 명령어로 디버깅할 수 있습니다:

```javascript
// 모든 마운트된 컴포넌트 확인
window.__ELEMENT_BUILDER_DEBUG__.logComponentTree()

// 특정 컴포넌트 정보 조회
window.__ELEMENT_BUILDER_DEBUG__.getComponent('Button')

// 모든 컴포넌트 목록
window.__ELEMENT_BUILDER_DEBUG__.getAllComponents()
```

## 🚀 사용법

### 기본 사용법

```tsx
import { ElementBuilder } from './ElementBuilder';

<ElementBuilder 
  elementBuilder={{
    name: 'Button',
    props: { children: 'Click me' },
    path: 'form.button'
  }} 
/>
```

### Form 요소 처리

Form 요소는 특별히 HTML `<form>` 태그로 렌더링됩니다:

```tsx
<ElementBuilder 
  elementBuilder={{
    name: 'Form',
    children: [
      {
        name: 'Input',
        props: { label: 'Email' },
        path: 'form.email'
      }
    ]
  }} 
/>
```

## 🐛 디버깅 팁

### 1. 컴포넌트가 렌더링되지 않는 경우

1. 브라우저 콘솔에서 에러 메시지 확인
2. ComponentManager에 컴포넌트가 등록되어 있는지 확인
3. 컴포넌트 이름의 대소문자 확인

### 2. props가 전달되지 않는 경우

1. 콘솔에서 props 변경 로그 확인
2. elementBuilder.props 구조 검증
3. path가 올바르게 설정되어 있는지 확인

### 3. 성능 문제 확인

1. 콘솔에서 렌더링 시간 확인 (⏱️ 로그)
2. 불필요한 리렌더링이 발생하는지 확인
3. 렌더링 횟수 확인 (🔄 로그)

### 4. 컴포넌트 트리 구조 확인

```javascript
// 콘솔에서 실행
window.__ELEMENT_BUILDER_DEBUG__.logComponentTree()
```

## 📊 로그 색상 가이드

- 🔨 **파란색**: 컴포넌트 렌더링 시작
- ✅ **녹색**: 성공 (컴포넌트 발견, 빠른 렌더링)
- ⚠️ **노란색**: 경고 (느린 렌더링, validation 정보)
- ❌ **빨간색**: 에러 (컴포넌트 없음)
- 🔄 **회색**: 일반 정보 (자식 렌더링, state 변경)

## 🛠️ 커스텀 디버깅

추가적인 디버깅이 필요한 경우 `debug.utils.ts`와 `debug.hooks.ts`를 확장할 수 있습니다.

### 새로운 로그 함수 추가

```typescript
export const logCustomEvent = (message: string, data?: any) => {
  if (!isDevelopment) return;
  console.log(`🔔 ${message}`, data);
};
```

### 새로운 hook 추가

```typescript
export const useCustomDebug = (elementName: string) => {
  useEffect(() => {
    // 커스텀 디버깅 로직
  }, [elementName]);
};
```

## 🔧 설정

환경 변수로 디버깅 수준을 조절할 수 있습니다:

```bash
NODE_ENV=development  # 모든 디버깅 기능 활성화
NODE_ENV=production   # 디버깅 기능 비활성화
```

## ⚠️ 주의사항

- 디버깅 기능은 개발 환경에서만 작동합니다
- 프로덕션 빌드에서는 자동으로 비활성화됩니다
- 과도한 로깅으로 인한 성능 저하에 주의하세요
- 민감한 데이터가 콘솔에 출력되지 않도록 주의하세요

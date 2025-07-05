# Builder 컴포넌트 생성 가이드

이 문서는 프로젝트의 Builder 아키텍처를 이해하고 새로운 컴포넌트나 기능을 일관성 있게 추가하기 위한 가이드입니다.

## 📋 목차

1. [아키텍처 개요](#아키텍처-개요)
2. [핵심 구조 분석](#핵심-구조-분석)
3. [Builder 컴포넌트 생성 참조](#builder-컴포넌트-생성-참조)
4. [명령 시 필요한 정보](#명령-시-필요한-정보)
5. [실제 구현 예시](#실제-구현-예시)

---

## 아키텍처 개요

### 전체 시스템 구조

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Backend       │    │   Frontend      │    │   Types         │
│                 │    │                 │    │                 │
│ AppBuilder      │───▶│ RouteBuilder    │◀───│ RouteBuilder    │
│ Controller      │    │ LayoutBuilder   │    │ Interface       │
│ Service         │    │ PageBuilder     │    │                 │
│ Routes          │    │ ElementBuilder  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 주요 특징

- **동적 화면 렌더링**: 백엔드에서 정의한 구조대로 프론트엔드가 동적으로 화면 구성
- **Meta-Programming**: Low-Code/No-Code 플랫폼 특성
- **인증 기반 라우팅**: 사용자 인증 상태에 따른 동적 라우트 필터링
- **계층적 구조**: 중첩된 라우트 및 컴포넌트 구조
- **타입 안전성**: TypeScript 기반 완전한 타입 정의

---

## 핵심 구조 분석

### 1. 백엔드 (서버 사이드)

#### AppBuilderController
- 클라이언트 요청을 받아 화면 구성 정보를 제공
- 인증 상태 확인 및 테넌트 선택 처리

#### AppBuilderService
- 사용자 인증 상태에 따라 라우트를 동적으로 필터링
- 인증된 사용자: 모든 라우트 접근 가능
- 비인증 사용자: auth 라우트만 접근 가능

#### Routes 정의
- 계층적 라우트 구조를 정의
- 각 화면의 구성 정보 포함

### 2. 프론트엔드 (클라이언트 사이드)

#### RouteBuilder
- 백엔드에서 받은 라우트 정보를 실제 React 컴포넌트로 렌더링
- PageProvider로 페이지 상태 관리
- LayoutBuilder와 PageBuilder를 조합

#### LayoutBuilder
- 다양한 레이아웃을 동적으로 적용
- 지원 레이아웃: Auth, Modal, Dashboard, Tab

#### PageBuilder
- 페이지 내 요소들을 동적으로 구성
- Elements 기반 (새로운 구조) + Sections 기반 (하위 호환성)

#### ElementBuilder
- ComponentManager를 통해 동적 컴포넌트 렌더링
- 에러 처리 및 검증 로직 포함

### 3. 상태 관리

#### MobX 기반
- observer 패턴으로 반응형 UI 구현
- NavigationStore: 라우트 상태 및 네비게이션 관리

---

## Builder 컴포넌트 생성 참조

### 1. 디렉토리 구조

```
packages/
├── shared-types/src/
│   ├── builders.ts          # 모든 Builder 인터페이스 정의
│   └── routes.ts           # 라우트 타입 정의
├── shared-frontend/src/components/
│   ├── builder/
│   │   ├── XxxBuilder/     # 새로운 Builder 컴포넌트 디렉토리
│   │   │   ├── XxxBuilder.tsx
│   │   │   └── index.ts
│   │   └── index.ts        # Builder export 관리
│   └── index.ts            # ComponentManager export
└── shared-vars/src/
    └── routes.ts           # 라우트 이름 상수 정의
```

### 2. 타입 정의 패턴

```typescript
// 위치: packages/shared-types/src/builders.ts

// Element 이름을 union type에 추가
export type ElementName =
  | 'AutoComplete'
  | 'Avatar'
  | 'Button'
  | 'NewComponent'  // 새로운 컴포넌트 추가
  // ... 기타

// Builder 인터페이스 정의
export interface XxxBuilder {
  name?: string;
  props?: XxxBuilderProps;
  validation?: Validation;
  children?: ElementBuilder[];
}

// Props 인터페이스 정의
export interface XxxBuilderProps {
  // 컴포넌트별 specific props
  title?: string;
  variant?: 'primary' | 'secondary';
  // ... 기타 props
}
```

### 3. 컴포넌트 구현 패턴

```typescript
// 위치: packages/shared-frontend/src/components/builder/XxxBuilder/XxxBuilder.tsx

import { observer } from 'mobx-react-lite';
import { XxxBuilder as XxxBuilderInterface } from '@shared/types';
import { usePage } from '../../../provider';

interface XxxBuilderProps {
  xxxBuilder: XxxBuilderInterface;
}

export const XxxBuilder = observer((props: XxxBuilderProps) => {
  const page = usePage();
  const state = page.state;
  const { xxxBuilder } = props;

  return (
    <div>
      {/* 컴포넌트 구현 */}
    </div>
  );
});

XxxBuilder.displayName = 'XxxBuilder';
```

### 4. Export 패턴

```typescript
// 위치: packages/shared-frontend/src/components/builder/XxxBuilder/index.ts
export { XxxBuilder } from './XxxBuilder';

// 위치: packages/shared-frontend/src/components/builder/index.ts
export * from './XxxBuilder';
```

### 5. ComponentManager 등록

```typescript
// ElementBuilder에서 동적으로 컴포넌트를 찾는 방식
const Component = ComponentManager[elementBuilder.name];

// 새로운 컴포넌트는 packages/shared-frontend/src/components/index.ts에서 
// export 되어야 ComponentManager에서 사용 가능
```

### 6. Store 패턴

```typescript
// 위치: packages/shared-frontend/src/store/xxxStore.ts

import { makeAutoObservable } from 'mobx';
import { PlateStore } from './plateStore';

export class XxxStore {
  // observable 프로퍼티들
  private _data: any[] = [];
  loading: boolean = false;
  
  constructor(private plateStore: PlateStore) {
    makeAutoObservable(this, {
      // 외부 수정 방지할 프로퍼티 설정
    });
  }

  // 메서드들
  async loadData() {
    this.loading = true;
    try {
      // 데이터 로딩 로직
    } finally {
      this.loading = false;
    }
  }
}
```

### 7. 백엔드 페이지 정의 패턴

```typescript
// 위치: apps/server/src/modules/app-builder/components/pages/xxx.page.ts

import { PageBuilder, ResourceBuilder } from '@shared/types';

export const getXxxPage = (
  type: 'create' | 'modify' | 'detail' = 'detail'
): PageBuilder => {
  return {
    elements: [
      {
        name: 'ResourceBuilder',
        props: {
          resourceName: 'xxx',
          sections: [
            {
              name: 'form',
              elements: [
                {
                  name: 'XxxBuilder',
                  props: {
                    // 페이지별 props
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  };
};
```

---

## 명령 시 필요한 정보

### 새로운 Builder 컴포넌트 생성 시

#### 필수 정보
1. **컴포넌트 이름**: `CalendarBuilder`, `ChartBuilder` 등
2. **기능 설명**: 어떤 UI를 렌더링할지 구체적 설명
3. **필요한 props**: 컴포넌트가 받을 데이터 구조
4. **상태 관리**: MobX store가 필요한지 여부

#### 선택 정보
1. **레이아웃 타입**: Modal, Dashboard, Tab 등 (필요한 경우)
2. **하위 컴포넌트**: children이 필요한지 여부
3. **검증 로직**: validation이 필요한지 여부

#### 예시
```
"사용자 프로필 카드를 표시하는 ProfileCardBuilder를 만들어줘.
- props: { userId: string, showActions: boolean, variant: 'compact' | 'detailed' }
- 사용자 정보를 표시하고 편집/삭제 액션 버튼 포함
- ProfileStore로 사용자 데이터 관리 필요"
```

### 새로운 Store 추가 시

#### 필수 정보
1. **Store 이름**: `CalendarStore`, `ProfileStore` 등
2. **관리할 상태**: 어떤 데이터를 관리할지
3. **필요한 메서드**: CRUD 등 어떤 기능이 필요한지

#### 예시
```
"사용자 프로필 관리를 위한 ProfileStore를 만들어줘.
- 상태: 사용자 목록, 선택된 사용자, 로딩 상태
- 메서드: 사용자 조회, 생성, 수정, 삭제
- API 연동 필요"
```

### 새로운 페이지 추가 시

#### 필수 정보
1. **페이지 이름**: `getProfilePage`, `getCalendarPage` 등
2. **페이지 구성 요소**: 어떤 Element들이 필요한지
3. **라우트 정보**: 어느 경로에 추가할지

#### 예시
```
"사용자 프로필 관리 페이지를 만들어줘.
- 경로: /admin/dashboard/user-service/profiles
- 구성: 사용자 목록 테이블 + 프로필 상세 모달
- CRUD 기능 모두 포함"
```

---

## 실제 구현 예시

### 예시 1: SimpleCardBuilder 생성

#### 1단계: 타입 정의
```typescript
// packages/shared-types/src/builders.ts에 추가

export type ElementName =
  | 'SimpleCard'  // 추가
  | 'AutoComplete'
  // ... 기존 코드

export interface SimpleCardBuilder {
  title?: string;
  content?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  showActions?: boolean;
}

export interface SimpleCardBuilderProps extends SimpleCardBuilder {}
```

#### 2단계: 컴포넌트 구현
```typescript
// packages/shared-frontend/src/components/builder/SimpleCardBuilder/SimpleCardBuilder.tsx

import { observer } from 'mobx-react-lite';
import { SimpleCardBuilder as SimpleCardBuilderInterface } from '@shared/types';
import { Card, Button } from '@heroui/react';

interface SimpleCardBuilderProps {
  simpleCardBuilder: SimpleCardBuilderInterface;
}

export const SimpleCardBuilder = observer((props: SimpleCardBuilderProps) => {
  const { simpleCardBuilder } = props;

  return (
    <Card className={`p-4 ${simpleCardBuilder.variant === 'primary' ? 'bg-blue-50' : ''}`}>
      {simpleCardBuilder.title && (
        <h3 className="text-lg font-semibold mb-2">{simpleCardBuilder.title}</h3>
      )}
      {simpleCardBuilder.content && (
        <p className="text-gray-600">{simpleCardBuilder.content}</p>
      )}
      {simpleCardBuilder.showActions && (
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="primary">편집</Button>
          <Button size="sm" variant="secondary">삭제</Button>
        </div>
      )}
    </Card>
  );
});

SimpleCardBuilder.displayName = 'SimpleCardBuilder';
```

#### 3단계: Export 설정
```typescript
// packages/shared-frontend/src/components/builder/SimpleCardBuilder/index.ts
export { SimpleCardBuilder } from './SimpleCardBuilder';

// packages/shared-frontend/src/components/builder/index.ts에 추가
export * from './SimpleCardBuilder';
```

#### 4단계: 백엔드 페이지에서 사용
```typescript
// apps/server/src/modules/app-builder/components/pages/example.page.ts

export const getExamplePage = (): PageBuilder => {
  return {
    elements: [
      {
        name: 'SimpleCard',
        props: {
          title: '사용자 정보',
          content: '사용자의 기본 정보를 표시합니다.',
          variant: 'primary',
          showActions: true
        }
      }
    ]
  };
};
```

---

## 🔧 개발 시 주의사항

### 1. 네이밍 컨벤션
- Builder 컴포넌트: `XxxBuilder`
- Store: `XxxStore` 
- 페이지 함수: `getXxxPage`
- Props 인터페이스: `XxxBuilderProps`

### 2. 필수 패턴
- MobX `observer` 사용
- `displayName` 설정
- 에러 핸들링 포함
- TypeScript 타입 정의

### 3. 프론트엔드 규칙 준수
- MobX 상태 관리
- `@shared/utils` logger 사용
- `@shared/frontend` 컴포넌트 우선 활용
- `@heroui/react` 백업 사용
- `@shared/types`에 props 정의
- 다크모드/라이트모드 고려

### 4. 백엔드 규칙 준수
- 서비스 로직은 service 단에 구현
- 폴더 경로: `apps/server`

이 가이드를 참조하여 일관성 있는 컴포넌트와 기능을 개발해주세요!

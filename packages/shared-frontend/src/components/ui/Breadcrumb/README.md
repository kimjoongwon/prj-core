# HeroUI Breadcrumb Component

HeroUI를 기반으로 한 반응형 Breadcrumb 컴포넌트입니다. 모바일과 PC 환경 모두에서 최적화된 사용자 경험을 제공합니다.

## 특징

- ✨ **HeroUI 기반**: 아름답고 일관된 디자인
- 📱 **완전한 반응형**: 모바일과 데스크톱 모두 지원
- 🎨 **커스터마이징 가능**: 스타일, 구분자, 색상 등 자유롭게 변경
- 🏠 **홈 아이콘 지원**: 선택적으로 홈 아이콘 표시
- 🔗 **클릭 이벤트**: 각 아이템 클릭 시 네비게이션 처리
- 📏 **최대 아이템 제한**: 긴 경로에서 ellipsis(...) 표시
- 🔍 **타입 안전성**: 완전한 TypeScript 지원

## 설치

```bash
# 프로젝트에 이미 설치되어 있음
# @heroui/react, lucide-react가 필요함
```

## 기본 사용법

### 1. 기본 Breadcrumb

```tsx
import { Breadcrumb } from '@shared/frontend';

const items = [
  { name: '홈', pathname: '/', active: false },
  { name: '제품', pathname: '/products', active: false },
  { name: '카테고리', pathname: '/products/category', active: false },
  { name: '상세정보', pathname: '/products/category/detail', active: true },
];

function MyComponent() {
  return <Breadcrumb items={items} />;
}
```

### 2. 홈 아이콘 포함

```tsx
<Breadcrumb
  items={items.slice(1)} // 홈 제외
  showHomeIcon={true}
  homeRouteName="홈"
  onItemClick={item => console.log('Clicked:', item)}
/>
```

### 3. 커스텀 구분자

```tsx
<Breadcrumb items={items} separator="→" />
<Breadcrumb items={items} separator="•" />
<Breadcrumb items={items} separator={<MyCustomIcon />} />
```

### 4. 최대 아이템 수 제한

```tsx
const longItems = [
  { name: '홈', pathname: '/', active: false },
  { name: '관리자', pathname: '/admin', active: false },
  { name: '사용자 관리', pathname: '/admin/users', active: false },
  { name: '권한 설정', pathname: '/admin/users/permissions', active: false },
  {
    name: '역할 관리',
    pathname: '/admin/users/permissions/roles',
    active: false,
  },
  {
    name: '상세 설정',
    pathname: '/admin/users/permissions/roles/detail',
    active: true,
  },
];

<Breadcrumb items={longItems} maxItems={3} />;
// 결과: ... → 역할 관리 → 상세 설정
```

### 5. 커스텀 스타일링

```tsx
<Breadcrumb
  items={items}
  className="bg-gray-50 p-4 rounded-lg"
  itemClassName="font-medium text-gray-700"
  activeItemClassName="text-primary-600 font-bold"
/>
```

### 6. BreadcrumbBuilder 사용

```tsx
import { BreadcrumbBuilder } from '@shared/frontend';

<BreadcrumbBuilder
  routeNames={['홈', '제품', '카테고리', '상세정보']}
  separator="/"
  className="my-breadcrumb"
/>;
```

## Props

### Breadcrumb Props

| Props                 | Type                                      | Default            | 설명                            |
| --------------------- | ----------------------------------------- | ------------------ | ------------------------------- |
| `items`               | `BreadcrumbItem[]`                        | -                  | 표시할 breadcrumb 아이템 배열   |
| `separator`           | `string \| React.ReactNode`               | `<ChevronRight />` | 구분자                          |
| `className`           | `string`                                  | `""`               | 추가 CSS 클래스                 |
| `itemClassName`       | `string`                                  | `""`               | 아이템에 적용할 CSS 클래스      |
| `activeItemClassName` | `string`                                  | `""`               | 활성 아이템에 적용할 CSS 클래스 |
| `maxItems`            | `number`                                  | -                  | 표시할 최대 아이템 수           |
| `showHomeIcon`        | `boolean`                                 | `false`            | 홈 아이콘 표시 여부             |
| `homeRouteName`       | `string`                                  | `"홈"`             | 홈 라우트 이름                  |
| `onItemClick`         | `(item: BreadcrumbItem \| Route) => void` | -                  | 아이템 클릭 콜백                |

### BreadcrumbBuilder Props

| Props                 | Type                        | Default | 설명                            |
| --------------------- | --------------------------- | ------- | ------------------------------- |
| `routeNames`          | `string[]`                  | -       | 라우트 이름 배열                |
| `separator`           | `string \| React.ReactNode` | `"/"`   | 구분자                          |
| `className`           | `string`                    | `""`    | 추가 CSS 클래스                 |
| `itemClassName`       | `string`                    | `""`    | 아이템에 적용할 CSS 클래스      |
| `activeItemClassName` | `string`                    | `""`    | 활성 아이템에 적용할 CSS 클래스 |

### BreadcrumbItem Interface

```tsx
interface BreadcrumbItem {
  name: string; // 표시할 이름
  pathname?: string; // 경로 (클릭 시 이동할 경로)
  active?: boolean; // 활성 상태
}
```

## 반응형 동작

### 모바일 (< 640px)

- 홈 아이콘의 텍스트 숨김 (아이콘만 표시)
- 아이템 최대 너비: 150px
- 긴 텍스트 자동 잘림

### 태블릿 (640px ~ 768px)

- 아이템 최대 너비: 200px

### 데스크톱 (> 768px)

- 아이템 너비 제한 없음
- 전체 텍스트 표시

## 스타일링 가이드

### Tailwind CSS 클래스 사용

```tsx
<Breadcrumb
  items={items}
  className="bg-white shadow-sm rounded-lg p-4"
  itemClassName="text-gray-600 hover:text-gray-900 font-medium"
  activeItemClassName="text-primary-600 font-semibold"
/>
```

### 커스텀 테마 적용

```tsx
// 다크 테마
<Breadcrumb
  items={items}
  className="bg-gray-800 p-4 rounded"
  itemClassName="text-gray-300 hover:text-white"
  activeItemClassName="text-blue-400 font-bold"
  separator={<ChevronRight className="text-gray-500" />}
/>

// 컬러풀 테마
<Breadcrumb
  items={items}
  className="bg-gradient-to-r from-purple-400 to-pink-400 p-4 rounded-lg"
  itemClassName="text-white font-medium hover:text-yellow-200"
  activeItemClassName="text-yellow-300 font-bold"
  separator="✨"
/>
```

## 접근성

- ARIA 라벨 자동 적용
- 키보드 네비게이션 지원
- 스크린 리더 호환
- 적절한 시맨틱 HTML 구조

## 성능 최적화

- React.memo 적용으로 불필요한 리렌더링 방지
- useMemo를 통한 계산 최적화
- useCallback을 통한 함수 메모이제이션

## 예제

전체 예제는 `BreadcrumbDemo.tsx` 파일을 참조하세요.

```tsx
import { BreadcrumbDemo } from '@shared/frontend';

// Storybook이나 개발 환경에서 데모 확인
<BreadcrumbDemo />;
```

## 문제 해결

### 클릭이 동작하지 않을 때

- `pathname` 속성이 설정되어 있는지 확인
- `active: true`인 아이템은 클릭할 수 없음
- `onItemClick` 콜백이 올바르게 설정되어 있는지 확인

### 스타일이 적용되지 않을 때

- HeroUI 테마가 올바르게 설정되어 있는지 확인
- Tailwind CSS가 빌드에 포함되어 있는지 확인
- 클래스 이름의 우선순위 확인

### 반응형이 동작하지 않을 때

- Tailwind CSS의 반응형 클래스가 활성화되어 있는지 확인
- 뷰포트 메타 태그가 설정되어 있는지 확인

## 기여

버그 리포트나 기능 요청은 이슈를 통해 제출해 주세요.

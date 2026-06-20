# fe-feature-agent 상세 지시

원본 에이전트 파일: `.codex/agents/37-fe-feature-agent.toml`

이 참고 문서는 예전에 에이전트 TOML에 있던 상세 구현 지시를 담고 있습니다. 얇은 에이전트 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---

## 플랫폼 라우팅

- 이 역할은 대상 파일 경로를 기준으로 플랫폼을 먼저 결정합니다.
- 웹 대상: `packages/fe-ui/**`, `apps/*/web/**` → `공통` + `웹 규칙` 섹션만 실행 규칙으로 적용합니다.
- 모바일 대상: `packages/fe-mo-ui/**`, `apps/mobile/**` → `공통` + `모바일 규칙` 섹션만 실행 규칙으로 적용합니다.
- 대상과 다른 플랫폼 섹션은 참고 자료로만 읽고, 금지/허용/출력 규칙을 실행 규칙으로 적용하지 않습니다.
- 하나의 delivery가 Web과 React Native를 모두 수정해야 하면 라우트 딜리버리 스펙의 단계를 플랫폼별로 나누고 각 대상에 맞는 섹션만 적용합니다.

## 공통

### 공통 실행 규칙

- 먼저 `플랫폼 라우팅`으로 현재 대상이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 서비스 딜리버리 스펙과 생성된 라우트 딜리버리 스펙의 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- 소스 담당자가 다른 파일이나 다른 플랫폼 대상이 필요하면 직접 확장하지 말고 최종 보고에 인계 필요성을 요약합니다.
- Storybook 스토리는 `fe-storybook-agent`가 맡습니다. 소스 담당 에이전트는 단위 테스트와 소스 계약만 맡고, Storybook 필요 시 spec 또는 최종 보고로 인계합니다.

## 웹 규칙

### 웹 런타임 기준 (필수)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` 대상에만 적용합니다.
- 웹 작업은 `@heroui/react` 원본 라이브러리 source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web 대상에서만 적용합니다.
- 모바일 대상에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

### 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- PC/Web UI 후보는 `@cocrepo/ui` export만 보지 말고 원본 라이브러리 `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 기존 widget/form/detail/action/input/selection/navigation/data-display 또는 `@heroui/react` component로 표현 가능한 UI를 Feature 안에서 raw `div`/`button`/`input`/`table` + className 조합으로 재구현하지 않습니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.

### Feature 컴포넌트 에이전트

**비즈니스 로직, 상태, API 호출, 라우터 이동을 포함하는 기능 컴포넌트**를 `packages/fe-ui/src/feature`에 생성합니다.

---

### 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|:--------:|------|
| Store 연결이 필요한 UI | ✅ | SideNav, UserMenu, SpaceSelector |
| API 호출이 필요한 컴포넌트 | ✅ | CommentList, NotificationBell |
| 라우터 이동이 필요한 경우 | ✅ | SearchBar (검색 결과 페이지 이동) |
| 복잡한 이벤트 핸들링 | ✅ | LoginForm (폼 제출, 유효성 검사) |
| Page가 여러 Widget/섹션/table을 업무 단위로 조합해야 하는 경우 | ✅ | CourseConsole, InquiryConsole |
| 순수 UI 조합만 필요 | ❌ | fe-widget-agent 사용 |
| 기본 UI 요소 | ❌ | `fe-data-display-agent`, `fe-feedback-agent`, `fe-overlay-agent`, 또는 관련 leaf 에이전트 사용 |
| 전체 페이지 구성 | ❌ | fe-route-agent 사용 |

---

### 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| 컴포넌트명 | ✅ | `[위치/역할][기능]` 패턴 |
| 사용할 Store | ⚪ | NavigationStore, AuthStore 등 |
| 사용할 API | ⚪ | @cocrepo/api에서 import할 함수 |
| 기반 Widget | ⚪ | 조합할 Widget 컴포넌트 |

### 출력

| 항목 | 경로 |
|------|------|
| 메인 컴포넌트 | `packages/fe-ui/src/feature/[Name]/[Name].tsx` |
| Feature spec | `packages/fe-ui/src/feature/[Name]/[Name].spec.md` |
| 커스텀 훅 | 필요 시 `packages/fe-hook/src/use[Name].ts` |
| 타입 정의 | `packages/fe-ui/src/feature/[Name]/types.ts` |
| barrel export | `packages/fe-ui/src/feature/[Name]/index.ts` |
| 상위 barrel | `packages/fe-ui/src/feature/index.ts` (추가) |

---

### 3. 핵심 규칙

### ✅ 권장

| 규칙 | 설명 |
|------|------|
| **자립적** | 자체적으로 데이터 페칭 및 상태 관리 |
| **로직 분리** | 재사용 가능한 복잡한 로직은 `@cocrepo/hook`의 `use[Name].ts` 훅으로 분리 |
| **observer 사용** | MobX 상태 구독을 위해 observer로 감싸기 |
| **@cocrepo/api 사용** | Orval 생성 함수 사용 |
| **next/navigation 사용** | useRouter로 페이지 이동 처리 |
| **에러/로딩 처리** | 로딩, 에러 상태를 UI로 표현 |
| **displayName 설정** | 디버깅을 위해 필수 |
| **첫 렌더 안정성 유지** | SSR 시점과 첫 클라이언트 렌더의 DOM 구조를 동일하게 유지 |
| **Widget 조합 소유** | Page가 직접 가질 수 없는 flow rail, metric grid, table group, tab group을 업무 feature로 조합 |
| **Feature 기획 스펙 동기화** | Feature가 시각 composition을 소유하면 `[Name].spec.md`에 화면 러프와 조합 Widget을 기록 |
| **One Component Per File** | Feature 파일은 exported Feature component 하나만 소유하고, private JSX subcomponent는 별도 Widget/Feature 파일로 분리 |
| **표면 최소화** | Web Feature는 기본적으로 surface-less이며, 독립 작업 덩어리일 때만 local `Surface`를 사용 |

### ♻️ 기존 컴포넌트 우선 원칙 (Critical)

1. `packages/fe-ui/src/{feature,widget,primitive}`에서 기존 컴포넌트를 먼저 검색합니다.
2. 요구사항을 충족하면 **새 컴포넌트를 생성하지 않고 기존 컴포넌트를 재사용**합니다.
3. 기능이 부족하면 **새 이름으로 복제하지 말고 기존 컴포넌트를 업그레이드**합니다.
4. 기존 컴포넌트 업그레이드 시 호출부를 함께 마이그레이션하고 중복 컴포넌트는 제거합니다.

### ❌ 금지

| 금지 사항 | 이유 |
|----------|------|
| **apps/*/src에 feature 폴더 생성** | **Feature는 반드시 packages/fe-ui에만 존재** |
| **Context API 사용 (createContext, useContext)** | **packages/fe-ui에서 Context 사용 금지 - props drilling 사용** |
| **컴포넌트 폴더 내 hooks/, utils/, inputs/ 하위 폴더 생성** | **패키지 레벨에서 관리 (hooks → `packages/fe-hook/src`, utils → `src/utils`, inputs → `src/{action,input,selection,navigation}`)** |
| reusable UI/Hook에 `Admin`, `Management` 접두/접미 사용 | 공용 패키지 이름은 역할명만 사용하고, admin 전용 의미가 확실한 경우에만 Feature 이름에서 `Admin` 허용 |
| 기존 Feature와 유사한 컴포넌트 신규 생성 | 중복 자산 증가 및 유지보수 비용 상승 |
| 커스텀 className 직접 사용 | UI/입력에서만 허용 |
| 직접 axios/fetch 호출 | @cocrepo/api 사용 필수 |
| Text를 Button/Chip children으로 | 테마 깨짐 발생 |
| inline style | Tailwind/HeroUI만 사용 |
| render/constructor에서 localStorage hydrate | hydration mismatch 유발 |
| Page가 소유해야 할 title/action/shell까지 Feature가 침범 | Page/PageTitleBar 책임 중복 |
| `ScreenSurface`, `SectionSurface`, 제거된 detail/form 이전 방식 surface wrapper 직접 사용 | route/screen 표면은 feature가 소유하지 않음 |
| Widget으로 분리 가능한 table/card/tabs/flow rail JSX를 Feature 파일에 대량 내장 | 재사용성 저하 |

> ⚠️ **Critical**: Feature 컴포넌트는 **절대로** 앱 내부 `src/feature/` 폴더에 생성하지 않습니다. 모든 Feature는 `packages/fe-ui/src/feature/`에서만 생성하여 재사용성을 보장합니다.

### Page Fatigue 방지 규칙 (Critical)

fe-route-agent가 page 파일 안에 lower-layer JSX를 직접 넣어야만 화면을 만들 수 있는 상태라면 fe-feature-agent가 먼저 개입합니다.

- Page가 `flow rail + metrics + tabs + table/form/detail`처럼 2개 이상의 재사용 UI 블록을 조합해야 하면 업무 feature를 만듭니다.
- Feature는 해당 화면의 업무 흐름과 active 상태 기반 조합을 담당하고, 개별 시각 블록은 Widget으로 분리합니다.
- Feature가 새 시각 composition을 소유하면 `[FeatureName].spec.md`에 `## 화면 러프`, 공개 props, 조합 Widget 목록을 기록합니다.
- Feature 기획 스펙에는 `에이전트 배정 매트릭스`, `실행 그래프`, 백엔드 빌드 순서, 기반 세부 실행표, 승인 단계를 쓰지 않습니다. 실행 순서와 승인 기록은 라우트 딜리버리 스펙이 소유합니다.
- Feature 파일 안에 table 행, card grid, tabs, form 섹션 같은 시각 블록이 길게 들어가면 fe-widget-agent로 먼저 분리합니다.
- fe-route-agent가 `ui-composition-gap`을 보고하면 담당 스펙의 웹 단계에서 해당 page/domain의 Feature/Widget 단계를 보강해 처리합니다.

### SSR / Hydration 규칙

- Feature는 첫 렌더 구조를 `localStorage`, `window`, `Date.now()`, `Math.random()` 결과에 의존해 바꾸지 않습니다.
- 브라우저 전용 상태는 상위 provider/effect에서 hydrate한 뒤 observer로 반영합니다.
- React Aria/HeroUI `id` mismatch가 보이면 해당 Feature 자체보다 앞선 형제 슬롯의 서버/클라이언트 조건 분기를 먼저 확인합니다.

### AiForm Feature 계약 (Critical)

Create/Update 페이지에서 재사용할 표준 `AiForm` Feature를 우선 구현 대상으로 취급합니다.

- 위치: `packages/fe-ui/src/feature/AiForm/`
- 역할:
  - 폼 상단에서 AI 채움 UX 제공
  - 스키마 선택(`aiSchemas`)
  - 필드 체크박스 선택(`fieldMeta[path].ai.fillable`)
  - `채우기` 버튼으로 AI patch 요청
- 입력 데이터:
  - `formState`, `fieldMeta`, `aiSchemas`, `uiPaths`, `options`
- 동작 규칙:
  - `fillable=false`, `hidden/readOnly/disabled` 경로는 선택 불가
  - 선택된 path만 AI 요청으로 전달
  - 응답 patch는 허용 path만 적용
  - 적용 후 검증(schema) 재실행

```ts
interface AiFormProps<TForm> {
  formState: TForm;
  fieldMeta: Record<string, { ai: { fillable: boolean; defaultChecked?: boolean; reason?: string } }>;
  aiSchemas: Array<{ key: string; label: string; paths: string[] }>;
  ui: { readOnlyPaths: string[]; hiddenPaths: string[]; disabledPaths: string[] };
  onFill: (input: { schemaKey: string; selectedPaths: string[]; currentObject: TForm; userPrompt?: string }) => Promise<{ patches: Array<{ path: string; value: unknown }> }>;
  applyPatch: (patches: Array<{ path: string; value: unknown }>) => void;
}
```

---

### 4. 프로세스

### 4.1 필요한 Widget/UI 확인

```markdown
Feature 개발 시 필요한 Widget이 없으면 **먼저 fe-widget-agent에게 생성 요청**
```

Feature가 page에서 분리된 업무 콘솔/관리 패널이면 다음 순서로 진행합니다.

1. route/page 스펙의 `## 화면 러프`와 lower-layer 조합 계획을 읽습니다.
2. 기존 Widget 재사용 후보를 검색합니다.
3. 부족한 UI 블록은 fe-widget-agent 대상 파일로 분리합니다.
4. Feature spec에 `## 화면 러프`와 조합 Widget 목록을 기록합니다.
5. Feature는 Widget 조합과 업무 분기만 구현하고, Page는 Feature import만 하도록 계약합니다.

### 4.2 네이밍 결정

| 패턴 | 설명 | 예시 |
|------|------|------|
| `[위치]Nav` | 특정 위치의 네비게이션 | SideNav, TopNav |
| `[위치]Tab` | 특정 위치의 탭 | BottomTab, HeaderTab |
| `[기능]Menu` | 메뉴 기능 | UserMenu, ContextMenu |
| `[기능]Selector` | 선택 기능 | SpaceSelector, ThemeSelector |
| `[기능]Form` | 폼 기능 | LoginForm, SearchForm |

> `HeaderBar`, `SidePanel`, `BottomNav`, `ActionFab`, `OverlayMenu`는 feature가 아니라 widget입니다. feature는 해당 widget에 store/API/router를 연결하는 래퍼만 담당합니다.
> reusable shell/slot/hook 이름에는 `Admin`, `Management` 같은 앱/도메인 접두사를 붙이지 않습니다. 예: `TopBar`, `SideNavigation`, `useCourseData`.

### 4.3 파일 구조 생성

```
packages/fe-ui/src/feature/[Name]/
├── [Name].tsx         # 메인 컴포넌트
├── types.ts           # 타입 정의 (해당 Feature 전용)
└── index.ts           # export

# ⚠️ 컴포넌트 폴더 내 hooks/, utils/, inputs/ 하위 폴더 생성 금지!
# 재사용 가능한 훅/유틸은 패키지 레벨에서 관리:
packages/fe-hook/src/use[Name].ts          # 재사용 가능한 훅
packages/fe-ui/src/utils/[utilName].ts     # UI 전용 유틸
```

### 4.4 barrel export 추가

`packages/fe-ui/src/feature/index.ts`에 새 컴포넌트 export 추가

---

### 5. 템플릿

### 5.1 메인 컴포넌트

```tsx
// packages/fe-ui/src/feature/CommentList/CommentList.tsx
import { observer } from "mobx-react-lite";
import { useCommentList } from "./useCommentList";
import { CommentItem } from "../../widget/CommentItem";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { Text } from "../../Text";

export interface CommentListProps {
  postId: string;
  onCommentDeleted?: () => void;
}

export const CommentList = observer<CommentListProps>(
  ({ postId, onCommentDeleted }) => {
    const {
      comments,
      isLoading,
      error,
      handleDelete,
      handleEdit,
    } = useCommentList({ postId, onCommentDeleted });

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <Text>댓글을 불러오는데 실패했습니다.</Text>;
    }

    return (
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    );
  },
);

CommentList.displayName = "CommentList";
```

### 5.2 커스텀 훅 (로직 분리)

```tsx
// packages/fe-hook/src/useCommentList.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetComments, useDeleteComment } from "@cocrepo/api";

interface UseCommentListParams {
  postId: string;
  onCommentDeleted?: () => void;
}

export function useCommentList({ postId, onCommentDeleted }: UseCommentListParams) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);

  // API 호출
  const { data: comments = [], isLoading, error, refetch } = useGetComments(postId);
  const { mutateAsync: deleteComment } = useDeleteComment();

  // 비즈니스 로직
  const handleDelete = async (commentId: string) => {
    await deleteComment(commentId);
    await refetch();
    onCommentDeleted?.();
  };

  const handleEdit = (commentId: string) => {
    setEditingId(commentId);
  };

  // 페이지 이동
  const handleNavigateToDetail = (commentId: string) => {
    router.push(`/comments/${commentId}`);
  };

  return {
    comments,
    isLoading,
    error,
    editingId,
    handleDelete,
    handleEdit,
    handleNavigateToDetail,
  };
}
```

### 5.3 Widget → Feature 분리 패턴

```typescript
// Widget (widget/NavTreePanel.tsx) - 순수 UI
export interface NavTreePanelProps {
  items: NavItemData[];
  expandedKeys: Set<string>;
  onToggle: (id: string) => void;
  onSelectItem: (id: string) => void;
  width?: number;
}

export const NavTreePanel = ({ items, expandedKeys, onToggle, ... }: NavTreePanelProps) => {
  // 순수 렌더링만 - Store 접근 없음
};

// Feature (feature/SideNav.tsx) - 비즈니스 로직
export const SideNav = observer(({ width, className }: SideNavProps) => {
  const store = useNavigationStore();

  // Store → Widget props 변환
  const handleToggle = (id: string) => store.toggleNavItem(id);

  return (
    <NavTreePanel
      items={store.items}
      expandedKeys={store.expandedKeys}
      onToggle={handleToggle}
      width={width}
    />
  );
});
```

### 5.4 라이브러리 타입 기반 설계

```tsx
import { Dropdown, DropdownProps } from "@heroui/react";

export interface UserMenuProps extends Omit<DropdownProps, "children"> {
  onLogout?: () => void;
  onProfileClick?: () => void;
}

export const UserMenu = observer(({ onLogout, onProfileClick, ...rest }: UserMenuProps) => {
  const authStore = useAuthStore();

  return (
    <Dropdown {...rest}>
      {/* Feature 로직 */}
    </Dropdown>
  );
});
```

### 5.5 index.ts

```ts
export { CommentList } from "./CommentList";
export type { CommentListProps } from "./CommentList";
```

---

### 6. 체크리스트

- [ ] 기존 Feature/Widget/UI 컴포넌트 검색 완료 (`rg --files packages/fe-ui/src`)
- [ ] 기존 컴포넌트 재사용 가능 여부 판단 및 결과 기록
- [ ] 기능 부족 시 기존 컴포넌트 업그레이드로 처리 (신규 복제 금지)
- [ ] `packages/fe-ui/src/feature/[Name]/` 에 생성
- [ ] 필요한 Widget이 없으면 fe-widget-agent에게 요청
- [ ] Page에서 분리된 업무 조합이면 `[Name].spec.md`에 `## 화면 러프`와 Widget 조합 목록 기록
- [ ] table/card/tabs/flow rail 같은 시각 블록을 Feature 파일에 직접 대량 구현하지 않음
- [ ] Page는 이 Feature를 import해서 조합만 하면 되는 상태인지 확인
- [ ] API 호출은 `@cocrepo/api` 사용
- [ ] 라우터 이동은 `next/navigation`의 `useRouter` 사용
- [ ] **라이브러리 타입 기반 Props 설계** (extends/Omit/Pick)
- [ ] 복잡한 로직은 `use[Name].ts`로 분리
- [ ] observer로 감싸기 (MobX 사용 시)
- [ ] 로딩/에러 상태 처리
- [ ] 커스텀 className 사용하지 않음
- [ ] displayName 설정
- [ ] index.ts에서 export
- [ ] feature/index.ts에 barrel export 추가
- [ ] reusable UI/Hook 이름에 `Admin`, `Management` 같은 불필요한 접두/접미를 붙이지 않음
- [ ] 실행 순서/agent assignment가 필요하면 Feature spec이 아니라 라우트 딜리버리 스펙에 기록

---

### 7. 연관 에이전트

### 컴포넌트 계층 구조

```
Pure UI → Widget → Feature → Page
(최소 단위)   (UI 조합)   (비즈니스 로직)   (화면)
```

### 선행 에이전트

| 에이전트 | 관계 |
|----------|------|
| orch-delivery | 담당 스펙과 Feature 담당 스펙 기반 구현 |
| fe-data-display-agent / fe-feedback-agent / fe-overlay-agent | Feature가 사용할 표시, 상태, overlay UI 컴포넌트 생성 |
| **fe-widget-agent** | Feature가 사용할 Widget 컴포넌트 생성 |
| **fe-store-agent** | Feature가 연결할 Store 생성 |

### 후행 에이전트

| 에이전트 | 관계 |
|----------|------|
| **fe-route-agent** | Feature를 조합하여 Page 생성 |

### 관련 에이전트

| 에이전트 | 관계 |
|----------|------|
| be-controller-builder | Feature가 호출할 API 엔드포인트 생성 |

---

### 8. 프로젝트별 참고사항

### Feature 예시 목록

| 컴포넌트 | 역할 | 포함 요소 |
|----------|------|-----------|
| `LoginForm` | 로그인 폼 | 인증 API, 폼 상태, 유효성 검사, 로그인 후 라우팅 |
| `CommentList` | 댓글 목록 | 댓글 CRUD API, 페이지네이션, 상세 페이지 이동 |
| `UserProfile` | 사용자 프로필 | 프로필 조회/수정 API |
| `NotificationBell` | 알림 벨 | 알림 조회 API, 읽음 처리, 알림 상세 이동 |
| `SearchBar` | 검색 바 | 검색 API, 자동완성, 검색 결과 페이지 이동 |

### 폼 검증 메시지 상수 활용

폼 관련 Feature에서는 `@cocrepo/schema`의 검증 메시지 상수를 활용합니다。

```typescript
import { VALIDATION_MESSAGES } from "@cocrepo/schema";

// 검증 메시지 상수
VALIDATION_MESSAGES.EMAIL_FORMAT    // "유효한 이메일 형식이 아닙니다"
VALIDATION_MESSAGES.REQUIRED        // "필수 항목입니다"
VALIDATION_MESSAGES.MIN_LENGTH      // "최소 {min}자 이상 입력해주세요"
```

**폼 Feature에서 활용 예시:**
```tsx
import { VALIDATION_MESSAGES } from "@cocrepo/schema";

const validateForm = (email: string, password: string): string | null => {
  if (!email) return VALIDATION_MESSAGES.REQUIRED;
  if (!email.includes("@")) return VALIDATION_MESSAGES.EMAIL_FORMAT;
  if (password.length < 8) return VALIDATION_MESSAGES.MIN_LENGTH;
  return null;
};
```

### 스타일링 규칙

| 허용 | 금지 |
|------|------|
| HeroUI 컴포넌트 (Button, Avatar, Dropdown 등) | 직접 Tailwind className 작성 |
| `<HStack>`, `<VStack>`, `<Spacer />` rhythm primitive | `className="flex gap-2 mt-4"` |
| Widget 컴포넌트 조합 | inline style (`style={{...}}`) |

### Widget → Feature 분리의 장점

- Feature 없이 Widget만 다른 곳에서 재사용 가능
- Store 교체 시 Feature만 수정


- Feature를 신규 생성하거나 수정하면 단위 테스트를 작성/갱신하고, Storybook 스토리는 `fe-storybook-agent`에 인계합니다.
- 단위 테스트는 Store/API/router를 mock하고 렌더링, 이벤트 위임, 상태 분기, 접근성 query를 검증합니다.
- 누락/실패/계약 drift는 이 agent의 완료 전 자체 검증 대상이며, 범위 밖 실패만 필요한 owner에게 인계합니다.

---
## 모바일 규칙

### 모바일 런타임 기준 (필수)

- 이 섹션은 `packages/fe-mo-ui/**`, `apps/mobile/**`, Expo Router route/`_layout.tsx` 대상에만 적용합니다.
- 작업 전에 `https://heroui.com/llms-patterns.txt`를 열어 HeroUI Native Composition/Styling/Provider/Portal 패턴을 확인합니다.
- 모바일 작업은 `heroui-native/*` 원본 라이브러리 source와 `@cocrepo/mo-ui` export를 먼저 확인하고, native callback/gesture/portal/provider 계약을 기준으로 판단합니다.
- 사용자 노출 텍스트는 `@cocrepo/mo-ui`의 `Text` primitive를 사용합니다. `react-native`의 `Text` 직접 import는 `packages/fe-mo-ui/src/data-display/Text` 구현 내부에서만 허용합니다.
- compound/action primitive가 문자열 children을 받으면 wrapper 내부에서 `Text`로 정규화하고 HeroUI Native에 raw string children을 그대로 넘기지 않습니다.
- HeroUI Native compound wrapper는 return-only re-export로 끝내지 않고, `label`, `helperText`, `errorMessage`, `title`, `description`, `items`, `trigger`, `actions` 같은 의미 있는 props와 dot-slot escape hatch를 함께 유지합니다.
- StyleSheet 금지: 신규/수정 UI는 `StyleSheet`/`StyleSheet.create` 대신 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용합니다.
- DOM 금지: DOM event, `event.target.value`, `window`, `document`, CSS selector, Next.js SSR/hydration, `@heroui/react`, browser-only 대체 처리, react-native-web 대응 코드를 React Native 대상에 넣지 않습니다.
- 웹 대상에서는 이 섹션의 `heroui-native`, `@cocrepo/mo-ui`, Expo/native 런타임 규칙을 실행 규칙으로 적용하지 않습니다.

### 모바일 범위

### 재사용 우선 점검 (필수)

- 작업 시작 전에 `packages/fe-mo-ui/src/feature`, 관련 widget/screen, route `index.spec.md`를 먼저 검색합니다.
- 하위 UI 후보가 없다고 판단하기 전에 원본 라이브러리 `node_modules/heroui-native/package.json` exports와 `node_modules/heroui-native/src/components/**` source를 확인합니다.
- 신규 생성 전에 기존 Feature를 확장해 해결할 수 있는지 우선 판단합니다.
- route/API/native bridge 책임과 중복되는 wrapper를 만들지 않습니다.
- Feature 내부에서 기존 widget/leaf로 표현 가능한 UI를 raw `View`/`Text`/`Pressable` + `tv` 조합으로 다시 만들지 않습니다.
- 필요한 하위 컴포넌트가 없으면 Feature 안에 즉석 구현하지 말고 해당 소유 역할의 선행 작업 필요성을 최종 보고에 남깁니다.

### 모바일 fe-feature-agent

React Native / Expo Native 기준의 reusable Feature composition을
`packages/fe-mo-ui/src/feature/**`에 생성하거나 정리하는 역할입니다.

### 담당 범위

- `packages/fe-mo-ui/src/feature/[Name]/[Name].tsx`
- `packages/fe-mo-ui/src/feature/[Name]/[Name].spec.md` 기획 스펙
- `packages/fe-mo-ui/src/feature/[Name]/index.ts`
- `packages/fe-mo-ui/src/feature/[Name]/types.ts` (필요 시)
- `packages/fe-mo-ui/src/feature/index.ts`
- 필요 시 `packages/fe-mo-ui/src/index.ts` export 동기화

### 핵심 원칙

- 모바일 Feature는 screen 내부에서 재사용되는 상호작용 단위입니다.
- Feature는 Widget과 모바일 UI leaf를 조합하고, 상태 범위와 handler를 props로 받습니다.
- 기존 Feature 또는 하위 조합이 80% 이상 맞으면 새 Feature를 만들지 말고 기존 조합을 확장하고 호출부를 함께 맞춥니다.
- API query/mutation, route params, navigation, native bridge는 `apps/mobile/src/app/**` route와 `fe-route-agent`가 소유합니다.
- `packages/fe-mo-ui` Feature가 직접 `@cocrepo/api`, `expo-router`, native module, storage hydrate에 의존하지 않습니다.
- One Component Per File 규칙을 따라 Feature 파일은 exported Feature component 하나만 소유하고, private JSX subcomponent는 별도 Widget/Feature/leaf 파일로 분리합니다.
- 외부 observable 범위를 소비하면 exported component를 `observer`로 감쌉니다.
- 스타일은 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용하고 `StyleSheet`/`StyleSheet.create`는 만들지 않습니다.
- `style` 객체는 className으로 표현하기 어려운 native 동적 값에만 제한합니다.
- 모바일 feature 기획 스펙에는 `에이전트 배정 매트릭스`, `실행 그래프`, 백엔드 빌드 순서, 기반 세부 실행표, 승인 단계를 쓰지 않습니다. 실행 순서와 route/API/native wiring은 라우트 딜리버리 스펙이 소유합니다.

### Do

- 복수 screen에서 반복되는 interaction composition을 Feature로 분리합니다.
- Feature가 사용할 순수 UI 조합은 먼저 `fe-widget-agent` 경계를 검토합니다.
- action/surface/selection/피드백/data-display 등 leaf 책임은 기존 컴포넌트 props, `className`, variant 확장으로 먼저 해결합니다.
- props 계약와 event handler 이름을 RN 문맥(`onPress*`, `onChange*`)에 맞춥니다.

### 금지

- 웹 `packages/fe-ui/src/feature` 규칙을 그대로 복제해 Next.js router/API hook을 끌어오지 않습니다.
- private JSX subcomponent를 같은 Feature 파일에 선언하지 않습니다.
- route file이 해야 할 data fetching, mutation invalidation, navigation side effect를 Feature에 넣지 않습니다.
- single-screen 시각 소유 역할을 Feature가 대신하지 않습니다. 전체 화면 구성은 `fe-screen-agent`가 소유합니다.

### 보고 포맷

- 생성/수정한 feature 경로
- 조합한 widget/leaf 목록
- 재사용한 기존 feature/하위 조합 또는 신규 Feature가 필요한 이유
- props/상태/action 계약 요약
- route/API/native boundary 확인 결과
- 함께 갱신한 barrel / 기획 스펙


- Feature를 신규 생성하거나 수정하면 모바일 단위 테스트를 작성/갱신하고, Storybook 스토리는 `fe-storybook-agent`에 인계합니다.
- 단위 테스트는 rendering, props/상태 분기, event callback, disabled guard, route/API boundary mock을 검증합니다.

---
name: req-L7L8-planner
description: 데이터 모델(Entity)과 UI 컴포넌트 레이어를 기획하는 전문가. 사용자가 "엔티티 설계", "데이터 모델링", "컴포넌트 기획" 등을 요청할 때 사용합니다.
allowed-tools: Read, Write, Grep, Bash
---

# L7-L8 데이터/컴포넌트 기획자 (Data/Component Planner)

화면에 필요한 **엔티티와 UI 컴포넌트**를 정의하고 `feature.spec.md`, `widget.spec.md`, `ui.spec.md`를 생성하는 전문가입니다.

---

## 담당 레이어

| 레벨 | 타입 | 설명 |
|------|------|------|
| **L7** | entity | 엔티티, 필드, 관계 |
| **L8** | component | UI 컴포넌트 (Feature, Widget, UI) |

---

## 출력 파일

```
packages/fe-ui/src/components/
├── feature/[FeatureName]/
│   └── index.spec.md           # Feature 기획서
├── widget/[WidgetName]/
│   └── index.spec.md           # Widget 기획서
└── ui/[UIName]/
    └── index.spec.md           # UI 기획서 (재사용 가능한 것만)
```

---

## 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| page.spec.md | ✅ | 각 페이지 기획서 |
| controller.spec.md | ✅ | API 정의 |
| 기존 컴포넌트 | ❌ | 재사용 가능한 컴포넌트 목록 |

---

## 프로세스

```
1단계: page.spec.md 읽기 → 필요한 컴포넌트 도출
   ↓
2단계: 기존 컴포넌트 확인 → 재사용 여부 판단
   ↓
3단계: 컴포넌트 분류 (Feature / Widget / UI)
   ↓
4단계: 각 컴포넌트별 .spec.md 생성
   ↓
5단계: page.spec.md에 하위 컴포넌트 섹션 업데이트
   ↓
→ req-L9L10-planner에게 전달
```

### 컴포넌트 분류 기준

| 유형 | 경로 | 특징 | Store | 예시 |
|------|------|------|-------|------|
| **Feature** | feature/ | 비즈니스 로직, Store 연결 | O | MemberList, MemberForm |
| **Widget** | widget/ | 도메인 특화 UI 조합 | X | MemberCard, SearchFilter |
| **UI** | ui/ | 순수 표현, 상태 없음 | X | Button, Card, Badge |
| **Input** | inputs/ | value/onChange 패턴 | X | Select, TextInput |

### 컴포넌트 분리 원칙

```
Widget (순수 UI)              Feature (비즈니스 로직)
─────────────────────────────────────────────────────
NavTreePanel                  → SideNav (NavigationStore 연결)
DataTable                     → MemberList (MemberStore 연결)
FormFields                    → MemberForm (MemberStore 연결)
```

---

## Feature 기획서 템플릿

```markdown
# [FeatureName] Feature 기획서

> 생성일: YYYY-MM-DD
> 수정일: YYYY-MM-DD
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/[FeatureName]/

## 역할

[기능 설명]

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | [StoreName] | [용도] |
| Widget | [WidgetName] | [용도] |
| API | useGet[Domain] | [용도] |

## Props

```typescript
interface [FeatureName]Props {
  spaceId: string;
  initialPageSize?: number;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| [StoreName] | items | 읽기 (표시) |
| [StoreName] | loading | 읽기 (로딩 표시) |
| [StoreName] | fetch | 호출 (데이터 로드) |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| onSelect | 행 클릭 | O (id) |
| onRefresh | 새로고침 버튼 | X |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 기획서 |
|----------|------|--------|
| [WidgetName] | widget | `../widget/[WidgetName]/index.spec.md` |
| [UIName] | ui | `../ui/[UIName]/index.spec.md` |

## 구현 체크리스트

- [ ] index.tsx
- [ ] observer 적용
- [ ] Store 주입

## 상위 기획서

- `apps/admin/app/(admin)/[domain]/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| YYYY-MM-DD | 초기 생성 | req-L7L8-planner |
```

---

## Widget 기획서 템플릿

```markdown
# [WidgetName] Widget 기획서

> 생성일: YYYY-MM-DD
> 수정일: YYYY-MM-DD
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/[WidgetName]/

## 역할

[위젯 설명]

## Props

```typescript
interface [WidgetName]Props {
  data: [DataType];
  variant?: 'compact' | 'full';
  onClick?: (id: string) => void;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| [UIName] | `../ui/[UIName]/index.spec.md` | [역할] |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| actions | 우측 액션 영역 |
| footer | 하단 추가 정보 |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| padding | p-4 |
| border | border-divider |
| radius | rounded-xl |

## 구현 체크리스트

- [ ] index.tsx
- [ ] Storybook 스토리

## 상위 기획서

- `packages/fe-ui/src/components/feature/[FeatureName]/index.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| YYYY-MM-DD | 초기 생성 | req-L7L8-planner |
```

---

## UI 기획서 템플릿

```markdown
# [UIName] UI 컴포넌트 기획서

> 생성일: YYYY-MM-DD
> 수정일: YYYY-MM-DD
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/[UIName]/

## 역할

[UI 설명]

## Props

```typescript
interface [UIName]Props {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
}
```

## 상태

| 상태 | 스타일 |
|------|--------|
| default | 기본 |
| hover | 배경 밝아짐 |
| disabled | opacity 0.5 |

## HeroUI 매핑

기반: `import { [HeroUIComponent] } from '@heroui/react'`

## 구현 체크리스트

- [ ] index.tsx
- [ ] Storybook 스토리

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| YYYY-MM-DD | 초기 생성 | req-L7L8-planner |
```

---

## 기존 컴포넌트 재사용 확인

```bash
# 기존 컴포넌트 존재 확인
search_paths=(
  "packages/fe-ui/src/components/feature/[FeatureName]/index.tsx"
  "packages/fe-ui/src/components/widget/[WidgetName]/index.tsx"
  "packages/fe-ui/src/components/ui/[UIName]/index.tsx"
)

for path in "${search_paths[@]}"; do
  if [ -f "$path" ]; then
    # 존재하면 .spec.md도 있는지 확인
    # 있으면 재사용, 없으면 역설계
  else
    # 없으면 새로 생성
  fi
done
```

---

## 품질 체크리스트

### L7 체크리스트
- [ ] API 응답에 필요한 엔티티 필드가 정의되었는가?
- [ ] 엔티티 간 관계가 파악되었는가?

### L8 체크리스트
- [ ] 모든 화면에 필요한 컴포넌트가 식별되었는가?
- [ ] 재사용 가능한 기존 컴포넌트가 확인되었는가?
- [ ] 컴포넌트 유형이 올바르게 분류되었는가?
  - Store 사용 → Feature
  - 순수 UI → Widget
  - 범용 → UI
- [ ] 각 컴포넌트별 .spec.md가 생성되었는가?

---

## 사용 예시

```
/req-L7L8-planner

도메인: Member
페이지 기획서:
- apps/admin/app/(admin)/users/page.spec.md (목록)
- apps/admin/app/(admin)/users/[userId]/page.spec.md (상세)

필요한 컴포넌트:
Feature: MemberList, MemberDetail, MemberForm
Widget: MemberCard, MemberTable, SearchFilter
UI: (기존 재사용)
```

---

## 연관 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| `/req-L5L6-planner` | 이전 단계 | 인터랙션/API |
| `/orch-requirement` | 상위 | 전체 기획 흐름 조율 |
| `/req-L9L10-planner` | 다음 단계 | 로직/테스트 기획 |

# TemplateActions Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/feature/message-template/TemplateActions/

## 역할

메시지 템플릿 상세 화면의 페이지 헤더 영역 actions 영역에 렌더링되는 액션 버튼 그룹 Feature 컴포넌트입니다.
미리보기, 테스트 발송, 수정, 삭제 기능 버튼을 수평으로 배치합니다.
Store에 직접 연결하지 않고 모든 핸들러를 props로 받는 Presentational Feature입니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[페이지 헤더 영역 actions 영역 - 우측 상단]

┌──────────────────────────────────────────────────┐
│  메시지 템플릿 상세          [👁 미리보기] [✉ 테스트 발송] [✎ 수정] [🗑 삭제] │
└──────────────────────────────────────────────────┘

[버튼 확대]
┌──────────────────────────────────────────────────────────────┐
│  [👁 미리보기]  [✉ 테스트 발송]  [✎ 수정 (primary)]  [🗑 삭제 (danger)] │
└──────────────────────────────────────────────────────────────┘

각 버튼 상세:
┌────────────┐ ┌──────────────┐ ┌─────────────────┐ ┌────────────────┐
│ 👁 미리보기 │ │ ✉ 테스트 발송 │ │ ✎ 수정  (blue)  │ │ 🗑 삭제  (red) │
│  flat       │ │  flat        │ │  flat, primary  │ │  flat, danger  │
└────────────┘ └──────────────┘ └─────────────────┘ └────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 (활성 템플릿) | 미리보기/테스트발송/수정/삭제 버튼 모두 표시 |
| 비활성 템플릿 | 동일 레이아웃, 상태 표시는 상위 컴포넌트에서 처리 |
| 처리 중 | 해당 버튼 로딩 상태 (상위 컴포넌트에서 제어) |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| UI Library | `@heroui/react` > `Button` | 액션 버튼 |
| Icon | `lucide-react` > `Eye`, `Pencil`, `Send`, `Trash2` | 버튼 아이콘 |
| Pure UI | `HStack` | 버튼 수평 배치 |

## Props

```typescript
interface TemplateActionsProps {
  /** 템플릿 ID */
  templateId: string;
  /** 활성 상태 */
  isActive: boolean;
  /** 수정 페이지 이동 핸들러 */
  onEdit: () => void;
  /** 삭제 핸들러 */
  onDelete: () => void;
  /** 활성/비활성 토글 핸들러 */
  onToggle: () => void;
  /** 미리보기 모달 열기 핸들러 */
  onPreview: () => void;
  /** 발송 테스트 모달 열기 핸들러 */
  onSendTest: () => void;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| (없음) | - | Props 기반 Presentational 컴포넌트 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onPreview` | 미리보기 버튼 클릭 시 | 부모에서 모달 열기 처리 |
| `onSendTest` | 테스트 발송 버튼 클릭 시 | 부모에서 모달 열기 처리 |
| `onEdit` | 수정 버튼 클릭 시 | 부모에서 페이지 이동 처리 |
| `onDelete` | 삭제 버튼 클릭 시 | 부모에서 삭제 확인 및 API 호출 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `Button` (미리보기) | HeroUI | Eye 아이콘, variant="flat" |
| `Button` (테스트 발송) | HeroUI | Send 아이콘, variant="flat" |
| `Button` (수정) | HeroUI | Pencil 아이콘, color="primary", variant="flat" |
| `Button` (삭제) | HeroUI | Trash2 아이콘, color="danger", variant="flat" |

## 구현 체크리스트

- [x] TemplateActions.tsx
- [x] index.ts (re-export)
- [x] observer 적용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |

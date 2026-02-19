# TemplateActions Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/message-template/TemplateActions/

## 역할

메시지 템플릿 상세 화면의 PageSurface actions 영역에 렌더링되는 액션 버튼 그룹 Feature 컴포넌트입니다.
미리보기, 테스트 발송, 수정, 삭제 기능 버튼을 수평으로 배치합니다.
Store에 직접 연결하지 않고 모든 핸들러를 props로 받는 Presentational Feature입니다.

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
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |

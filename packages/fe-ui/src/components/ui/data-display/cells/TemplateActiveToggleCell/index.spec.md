# TemplateActiveToggleCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/TemplateActiveToggleCell/

## 역할

메시지 템플릿의 활성/비활성을 인라인 Switch로 토글하는 Cell 컴포넌트. Optimistic UI를 적용하여 즉시 상태를 변경하고, API 실패 시 롤백한다.

## Props

```typescript
interface TemplateActiveToggleCellProps {
  /** 활성 여부 */
  isActive: boolean;
  /** 템플릿 ID */
  templateId: string;
  /** 토글 콜백 (API 호출) */
  onToggle: (id: string) => Promise<void>;
}
```

## 동작 흐름

1. Switch 클릭 -> 즉시 UI 상태 반전 (Optimistic)
2. `onToggle(templateId)` 호출
3. 성공 -> 상태 유지
4. 실패 -> 이전 상태로 롤백
5. 진행 중 -> Switch 비활성화 (중복 클릭 방지)

## HeroUI 매핑

- `Switch` (size="sm")
- `"use client"` 필수 (useState 사용)
- 중앙 정렬 (`flex w-full justify-center`)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |

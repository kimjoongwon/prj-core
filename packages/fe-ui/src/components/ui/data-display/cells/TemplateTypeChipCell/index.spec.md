# TemplateTypeChipCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/TemplateTypeChipCell/

## 역할

메시지 템플릿 유형(EMAIL, SMS, PUSH)을 컬러 코딩된 Chip으로 표시하는 Cell 컴포넌트.

## Props

```typescript
interface TemplateTypeChipCellProps {
  /** 템플릿 유형 */
  type?: "EMAIL" | "SMS" | "PUSH" | null;
}
```

## 표시 규칙

| 값 | 표시 텍스트 | Chip color |
|---|---|---|
| `EMAIL` | 이메일 | primary |
| `SMS` | SMS | secondary |
| `PUSH` | 푸시 | warning |
| `null` / `undefined` | - | (text-default-400) |
| 기타 | 원본 문자열 | default |

## HeroUI 매핑

- `Chip` (size="sm", variant="flat")
- 중앙 정렬 (`flex w-full justify-center`)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |

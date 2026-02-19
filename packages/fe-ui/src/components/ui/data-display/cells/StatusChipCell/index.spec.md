# StatusChipCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/StatusChipCell/

## 역할

엔티티 상태(active, inactive, pending, removed)를 Chip으로 표시하는 Cell 컴포넌트. `removedAt`이 있으면 "탈퇴대기" 상태로 우선 표시한다.

## Props

```typescript
interface StatusChipCellProps {
  /** 상태값 (active, inactive, pending 등) */
  status?: string;
  /** 삭제 예정 시간 (있으면 "탈퇴대기" 상태로 표시) */
  removedAt?: Date | string | null;
}
```

## 표시 규칙

| 조건 | 표시 텍스트 | Chip color |
|---|---|---|
| `removedAt` 존재 | 탈퇴대기 | danger |
| `status="active"` | 활성 | success |
| `status="inactive"` | 비활성 | default |
| `status="pending"` | 대기 | warning |
| status 미지정 | 활성 (기본값) | success |
| 기타 | 원본 문자열 | default |

## HeroUI 매핑

- `Chip` (size="sm", variant="flat")
- 중앙 정렬 (`flex w-full justify-center`)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |

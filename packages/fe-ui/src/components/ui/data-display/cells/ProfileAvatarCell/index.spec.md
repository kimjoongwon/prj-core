# ProfileAvatarCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/ProfileAvatarCell/

## 역할

아바타 이미지 + 이름 + 부제목(이메일, ID 등)을 가로 배치하여 표시하는 Cell 컴포넌트.

## Props

```typescript
interface ProfileAvatarCellProps {
  /** 이름 */
  name?: string | null;
  /** 부제목 (이메일, ID 등) */
  subtitle?: string | null;
  /** 아바타 이미지 URL */
  src?: string | null;
  /** 아바타 아이콘 (src가 없을 때 표시) */
  icon?: ReactNode;
}
```

## 표시 규칙

| 요소 | 조건 | 스타일 |
|---|---|---|
| Avatar | 항상 표시 | size="sm", bg-primary/10, text-primary |
| 이름 | name이 있으면 표시, 없으면 "-" | font-medium |
| 부제목 | subtitle이 있을 때만 표시 | text-xs text-default-400 |

## HeroUI 매핑

- `Avatar` (size="sm") - name/src/icon 지원
- `flex items-center gap-3` 레이아웃

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |

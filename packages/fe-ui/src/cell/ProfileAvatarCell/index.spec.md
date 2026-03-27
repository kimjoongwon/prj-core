# ProfileAvatarCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/cell/ProfileAvatarCell/

## 역할

아바타 이미지 + 이름 + 부제목(이메일, ID 등)을 가로 배치하여 표시하는 Cell 컴포넌트.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시:

┌─────────────────────────────────────┐
│ 사용자                               │
├─────────────────────────────────────┤
│  ┌──┐  홍길동                        │
│  │🖼│  hong@example.com             │  ← 이미지 아바타 + 이름 + 이메일
│  └──┘                               │
├─────────────────────────────────────┤
│  ┌──┐  김철수                        │
│  │ K│  kim@example.com              │  ← 이니셜 아바타 (이미지 없을 때)
│  └──┘                               │
├─────────────────────────────────────┤
│  ┌──┐  -                            │
│  │ ?│                               │  ← 이름 없음 (아이콘 아바타)
│  └──┘                               │
└─────────────────────────────────────┘

레이아웃: [Avatar(sm)] [이름(font-medium)] / [부제목(text-xs, text-default-400)]
          ←───gap-3───→
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 이미지 + 이름 + 부제목 | `[사진] 홍길동 / hong@example.com` |
| 이니셜 + 이름 + 부제목 | `[H] 홍길동 / hong@example.com` |
| 아이콘 + 이름만 | `[아이콘] 홍길동` (부제목 없음) |
| 이름 없음 | `[아이콘] -` |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |

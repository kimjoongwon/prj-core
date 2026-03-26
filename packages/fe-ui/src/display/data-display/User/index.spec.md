# User UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/display/data-display/User/

## 역할

사용자 아바타와 드롭다운 메뉴를 표시하는 기본 컴포넌트.

**@deprecated** - Avatar 컴포넌트를 사용하세요.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[ 기본 (하드코딩된 상태) ]

  ┌──────────────────────────────┐
  │  ┌──┐  사용자 이름        ▾  │
  │  │  │  설명 텍스트           │
  │  └──┘                        │
  └──────────────────────────────┘
       ↓ 클릭 시 드롭다운
  ┌──────────────────────────────┐
  │  메뉴 항목 1                  │
  │  메뉴 항목 2                  │
  │  메뉴 항목 3                  │
  └──────────────────────────────┘

  ⚠ @deprecated: Avatar 컴포넌트로 대체 예정
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 하드코딩된 사용자 정보 + 드롭다운 (deprecated) |

## Props

```typescript
// Props 없음 (하드코딩된 상태)
```

## HeroUI 매핑

기반: `import { User, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) - deprecated 상태 | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |

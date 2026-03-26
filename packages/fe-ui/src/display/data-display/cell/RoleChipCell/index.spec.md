# RoleChipCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/display/data-display/cell/RoleChipCell/

## 역할

역할(Role) 객체를 Chip으로 표시하는 Cell 컴포넌트. 역할 이름에 따라 색상이 달라진다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시:

┌──────────────────────┐
│ 역할                  │
├──────────────────────┤
│ ╔══════════════╗     │
│ ║ 슈퍼관리자   ║     │  ← FULL_ACCESS (primary, 파란 계열)
│ ╚══════════════╝     │
├──────────────────────┤
│ ╔════════╗           │
│ ║ 관리자 ║           │  ← MANAGE (primary, 파란 계열)
│ ╚════════╝           │
├──────────────────────┤
│ ╔══════════╗         │
│ ║ 프로젝트 ║         │  ← PROJECT (secondary, 보라 계열)
│ ╚══════════╝         │
├──────────────────────┤
│ ╔══════╗             │
│ ║ 일반 ║             │  ← 기타 (default, 회색 계열)
│ ╚══════╝             │
├──────────────────────┤
│ -                    │  ← null/undefined (text-default-400)
└──────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| FULL_ACCESS | `[ 슈퍼관리자 ]` (primary, 파란 계열) |
| MANAGE | `[ 관리자 ]` (primary, 파란 계열) |
| PROJECT | `[ 프로젝트 ]` (secondary, 보라 계열) |
| 기타 | `[ 일반 ]` (default, 회색 계열) |
| null / undefined | `-` (text-default-400) |

## Props

```typescript
interface Role {
  name?: string;
  displayName?: string;
}

interface RoleChipCellProps {
  /** 역할 객체 */
  role?: Role | null;
}
```

## 표시 규칙

| 역할 name | Chip color | 표시 텍스트 |
|---|---|---|
| `FULL_ACCESS` | primary | displayName 또는 name |
| `MANAGE` | primary | displayName 또는 name |
| `PROJECT` | secondary | displayName 또는 name |
| 기타 | default | displayName 또는 name |
| `null` / `undefined` | (없음) | - (text-default-400) |

## HeroUI 매핑

- `Chip` (size="sm", variant="flat")

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |

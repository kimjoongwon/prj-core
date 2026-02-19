# TemplateTypeChipCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/TemplateTypeChipCell/

## 역할

메시지 템플릿 유형(EMAIL, SMS, PUSH)을 컬러 코딩된 Chip으로 표시하는 Cell 컴포넌트.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시 (중앙 정렬):

┌──────────────────────┐
│ 유형                  │
├──────────────────────┤
│     ╔════════╗       │
│     ║ 이메일 ║       │  ← EMAIL (primary, 파란 계열)
│     ╚════════╝       │
├──────────────────────┤
│     ╔═════╗          │
│     ║ SMS ║          │  ← SMS (secondary, 보라 계열)
│     ╚═════╝          │
├──────────────────────┤
│     ╔══════╗         │
│     ║ 푸시 ║         │  ← PUSH (warning, 노란 계열)
│     ╚══════╝         │
├──────────────────────┤
│     -                │  ← null/undefined (text-default-400)
└──────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| EMAIL | `[ 이메일 ]` (primary, 파란 계열) |
| SMS | `[ SMS ]` (secondary, 보라 계열) |
| PUSH | `[ 푸시 ]` (warning, 노란 계열) |
| null / undefined | `-` (text-default-400) |
| 기타 | `[ 원본 문자열 ]` (default, 회색 계열) |

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
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |

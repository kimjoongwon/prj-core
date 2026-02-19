# ChipSelect Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/ChipSelect/

## 역할

MobX state와 연동하는 Chip 기반 선택 컴포넌트. single/multiple 선택 모드를 지원한다. `useFormField` 훅을 통해 양방향 바인딩을 제공한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[multiple 모드 - 다중 선택]
옵션 선택:
┌─────────────────────────────────────────────────────┐
│  [공지사항]  [이벤트 ✕]  [FAQ ✕]  [뉴스]  [가이드] │
└─────────────────────────────────────────────────────┘
  (미선택)     (선택됨)    (선택됨)  (미선택) (미선택)

[single 모드 - 단일 선택]
카테고리:
┌───────────────────────────────────────────────┐
│  [전체]  [활성 ✓]  [비활성]  [삭제됨]         │
└───────────────────────────────────────────────┘
           (선택됨)

[선택 없음 초기 상태]
태그:
┌─────────────────────────────────────────────┐
│  [React]  [TypeScript]  [NestJS]  [Prisma]  │
└─────────────────────────────────────────────┘
  (모두 미선택, 클릭하면 선택됨)

[전체 선택 상태 - multiple]
태그:
┌──────────────────────────────────────────────────────────┐
│  [React ✕]  [TypeScript ✕]  [NestJS ✕]  [Prisma ✕]     │
└──────────────────────────────────────────────────────────┘
  (모두 선택됨, ✕ 클릭으로 개별 해제)
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| multiple (기본) | 여러 칩 선택 가능, 선택된 칩에 ✕ 버튼 표시 |
| single | 하나의 칩만 선택, 선택된 칩 강조 표시 |
| 미선택 | 모든 칩 기본 스타일 |
| 선택됨 | 선택된 칩 primary 색상 + ✕(multiple) 또는 체크(single) |
| 비활성화 | 흐릿하게 표시, 상호작용 불가 |

## Props

```typescript
interface ChipSelectProps<T> extends MobxProps<T>,
  Omit<BaseChipSelectProps, "value" | "onSelectionChange"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- `options`: 선택 가능한 옵션 목록
- `selectionMode`: "single" | "multiple" (기본값: "multiple")

## 상태

| 모드 | 초기값 | 변경 값 |
|------|------|------|
| single | `tools.get(state, path)` (string 또는 null) | string 또는 null |
| multiple | `tools.get(state, path)` (string[] 또는 빈 배열) | string[] |

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅으로 양방향 바인딩

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |

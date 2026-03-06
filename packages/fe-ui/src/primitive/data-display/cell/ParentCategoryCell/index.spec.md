# ParentCategoryCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/primitive/data-display/cell/ParentCategoryCell/

## 역할

부모 카테고리명을 표시하는 Cell 컴포넌트. 부모가 없으면 "-"를 표시한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시:

┌───────────────────────┐
│ 상위 카테고리          │
├───────────────────────┤
│ 공지사항               │  ← 유효한 부모 카테고리명
├───────────────────────┤
│ 기술 문서              │
├───────────────────────┤
│ -                     │  ← null/undefined (text-default-400, 회색)
└───────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 부모 존재 | `공지사항` (기본 텍스트 색상) |
| 부모 없음 | `-` (text-default-400, 흐린 회색) |

## Props

```typescript
interface ParentCategoryCellProps {
  /** 부모 카테고리명 (없으면 null) */
  parentName: string | null | undefined;
}
```

## 표시 규칙

| 값 | 표시 | 스타일 |
|---|---|---|
| 유효한 문자열 | 해당 문자열 | 기본 |
| `null` / `undefined` / `""` | - | text-default-400 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |

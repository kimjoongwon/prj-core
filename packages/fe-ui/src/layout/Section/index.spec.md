# Section 컴포넌트 기획서

> 생성일: 2026-03-03
> 타입: layout
> 위치: packages/fe-ui/src/layout/Section/

## 역할

페이지 내부 구역을 `top`, `left`, `children`, `right`, `bottom` 슬롯으로 배치하는 레이아웃 컴포넌트입니다.
도메인 위젯/피처를 어떤 위치에 놓을지 결정하는 구조 책임만 가집니다.
`App > Layout > Page > Section` 위계에서 최하위 구조 레벨입니다.

## Props

```typescript
interface SectionProps {
  top?: ReactNode;
  bottom?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
}
```

## 동작

- 단일 Content-First 구조로 렌더링합니다.
- `top`/`bottom` 슬롯은 세로 축 상단/하단에 렌더링합니다.
- 중앙 영역은 `left`/`children`/`right` 3분할 구조로 렌더링합니다.
- 각 슬롯은 전달된 경우에만 조건부 렌더링합니다.
- 높이/스크롤(`h-full`, `overflow-*`)은 강제하지 않으며 화면 단에서 제어합니다.
- 시각 디자인(테두리, 카드, 그림자)은 담당하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 섹션 구조 배치 규칙에 맞춰 `Section` spec 신규 작성 | codex |
| 2026-03-03 | Shell 접미사 제거에 맞춰 컴포넌트 명을 `Section`으로 변경 | codex |
| 2026-03-03 | 폴더명을 `Section` 기준으로 정리하고 경로 표기 갱신 | codex |
| 2026-03-03 | `mode` prop을 제거하고 Content-First 단일 렌더 구조로 통합 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-04 | `App > Layout > Page > Section` 위계 기준으로 Section 레벨 책임 명시 | codex |

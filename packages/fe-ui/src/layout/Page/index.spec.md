# Page 컴포넌트 기획서

> 생성일: 2026-03-03
> 타입: layout
> 위치: packages/fe-ui/src/layout/Page/

## 역할

페이지 단위의 구조 배치를 정의하는 레이아웃 컴포넌트입니다.
`top`, `leftAside`, `children`, `rightAside`, `bottom`, `footer` 슬롯을 조합해 페이지 콘텐츠 구조만 제공합니다.
`App > Layout > Page > Section` 위계에서 `Layout` 하위, `Section` 상위 레벨입니다.

## Props

```typescript
interface PageProps {
  header?: ReactNode;
  top?: ReactNode;
  leftAside?: ReactNode;
  rightAside?: ReactNode;
  bottom?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}
```

## 동작

- 단일 Content-First 구조로 렌더링합니다.
- 상단은 `header` 다음 `top` 순서로 렌더링합니다.
- 본문은 `leftAside`/`children`/`rightAside` 3분할 구조를 가집니다.
- 하단은 `bottom` 다음 `footer` 순서로 렌더링합니다.
- 높이/스크롤(`h-screen`, `overflow-*`)은 강제하지 않으며 각 페이지에서 명시합니다.
- 시각 디자인(카드/테두리/그림자)은 담당하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 페이지 구조 배치 규칙에 맞춰 `Page` spec 신규 작성 | codex |
| 2026-03-03 | Shell 접미사 제거에 맞춰 컴포넌트 명을 `Page`로 변경 | codex |
| 2026-03-03 | 폴더명을 `Page` 기준으로 정리하고 경로 표기 갱신 | codex |
| 2026-03-03 | `mode` prop을 제거하고 Content-First 단일 렌더 구조로 통합 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-04 | `App > Layout > Page > Section` 위계 기준으로 Page 레벨 책임 명시 | codex |

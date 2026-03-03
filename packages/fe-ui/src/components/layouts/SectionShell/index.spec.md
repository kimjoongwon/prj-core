# SectionShell Layout 컴포넌트 기획서

> 생성일: 2026-03-03
> 타입: layout
> 위치: packages/fe-ui/src/components/layouts/SectionShell/

## 역할

페이지 내부 구역을 `top`, `left`, `children`, `right`, `bottom` 슬롯으로 배치하는 레이아웃 컴포넌트입니다.
도메인 위젯/피처를 어떤 위치에 놓을지 결정하는 구조 책임만 가집니다.

## Props

```typescript
interface SectionShellProps {
  top?: ReactNode;
  bottom?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
}
```

## 동작

- `top`/`bottom` 슬롯은 세로 축 상단/하단에 렌더링합니다.
- 중앙 영역은 `left`/`children`/`right` 3분할 구조로 렌더링합니다.
- 각 슬롯은 전달된 경우에만 조건부 렌더링합니다.
- 시각 디자인(테두리, 카드, 그림자)은 담당하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 섹션 구조 배치 규칙에 맞춰 `SectionShell` spec 신규 작성 | codex |

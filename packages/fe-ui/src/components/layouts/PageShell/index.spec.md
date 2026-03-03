# PageShell Layout 컴포넌트 기획서

> 생성일: 2026-03-03
> 타입: layout
> 위치: packages/fe-ui/src/components/layouts/PageShell/

## 역할

페이지 단위의 구조 배치를 정의하는 레이아웃 컴포넌트입니다.
`header`, `leftAside`, `rightAside`, `footer`, `children(main)` 슬롯을 조합해 화면 골격만 제공합니다.

## Props

```typescript
interface PageShellProps {
  header?: ReactNode;
  leftAside?: ReactNode;
  rightAside?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}
```

## 동작

- 상단 `header`는 `sticky top-0`로 배치합니다.
- 본문 영역은 `leftAside`/`main(children)`/`rightAside` 3영역 구조를 가집니다.
- `footer`가 있으면 하단 고정 슬롯으로 렌더링합니다.
- 시각 디자인(카드/테두리/그림자)은 담당하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 페이지 구조 배치 규칙에 맞춰 `PageShell` spec 신규 작성 | codex |

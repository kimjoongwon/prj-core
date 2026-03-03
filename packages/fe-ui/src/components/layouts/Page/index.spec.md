# Page 컴포넌트 기획서

> 생성일: 2026-03-03
> 타입: layout
> 위치: packages/fe-ui/src/components/layouts/Page/

## 역할

페이지 단위의 구조 배치를 정의하는 레이아웃 컴포넌트입니다.
`header`, `leftAside`, `rightAside`, `footer`, `children(main)` 슬롯을 조합해 화면 골격만 제공합니다.

## Props

```typescript
interface PageProps {
  mode?: "shell" | "content";
  header?: ReactNode;
  top?: ReactNode;
  leftAside?: ReactNode;
  rightAside?: ReactNode;
  footer?: ReactNode;
  bottom?: ReactNode;
  className?: string;
  children: ReactNode;
}
```

## 동작

- 상단 `header`는 `sticky top-0`로 배치합니다.
- 본문 영역은 `leftAside`/`main(children)`/`rightAside` 3영역 구조를 가집니다.
- `footer`가 있으면 하단 고정 슬롯으로 렌더링합니다.
- `mode="content"`에서는 `_client.tsx`용 페이지 콘텐츠 컨테이너로 동작하며 `top`/`bottom` 슬롯을 사용합니다.
- 시각 디자인(카드/테두리/그림자)은 담당하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 페이지 구조 배치 규칙에 맞춰 `Page` spec 신규 작성 | codex |
| 2026-03-03 | Shell 접미사 제거에 맞춰 컴포넌트 명을 `Page`로 변경 | codex |
| 2026-03-03 | 폴더명을 `Page` 기준으로 정리하고 경로 표기 갱신 | codex |
| 2026-03-03 | `_client.tsx` 반복 헤더 제거를 위해 `mode="content"` 및 `top/bottom` 슬롯 추가 | codex |

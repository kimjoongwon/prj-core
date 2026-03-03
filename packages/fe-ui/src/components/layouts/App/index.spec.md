# App 컴포넌트 기획서

> 생성일: 2026-03-03
> 타입: layout
> 위치: packages/fe-ui/src/components/layouts/App/

## 역할

애플리케이션 루트(`app/layout.tsx`)에서 `body` 내부를 감싸는 최상위 레이아웃 래퍼입니다.
배치/스타일 책임 없이 `children` 전달만 담당합니다.

## Props

```typescript
interface AppProps {
  children: ReactNode;
}
```

## 동작

- `children`을 그대로 렌더링합니다.
- 추가 DOM wrapper를 만들지 않고 Fragment를 반환합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 루트 레이아웃 규칙에 맞춰 `App` spec 신규 작성 | codex |
| 2026-03-03 | Shell 접미사 제거에 맞춰 컴포넌트 명을 `App`으로 변경 | codex |
| 2026-03-03 | 폴더명을 `App` 기준으로 정리하고 경로 표기 갱신 | codex |

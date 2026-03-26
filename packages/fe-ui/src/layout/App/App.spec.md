# App layout 기획서

> 생성일: 2026-03-03
> 타입: layout
> 위치: packages/fe-ui/src/layout/App/App.tsx

## 역할

애플리케이션 루트(`app/layout.tsx`)에서 `body` 내부를 감싸는 최상위 레이아웃 컴포넌트입니다.
서비스별로 단일 `App` 인스턴스만 존재하며, 하위 `Layout` 계층의 진입 경계를 제공합니다.

## 공개 계약

```typescript
interface AppProps {
  children: ReactNode;
}
```

## 위계 위치

```text
App (서비스별 단일) > Layout > Page > Section
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | 서비스별 단일 App 규칙 및 표준 위계(`App > Layout > Page > Section`) 반영 | codex |

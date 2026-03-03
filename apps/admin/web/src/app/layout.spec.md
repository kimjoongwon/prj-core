# 루트 레이아웃 기획서

> 생성일: 2026-03-03
> 타입: layout
> 위치: apps/admin/web/src/app/layout.tsx

## 역할

루트 HTML 문서(`html`, `body`)를 구성하고 `Providers`와 `App`으로 전체 앱을 감쌉니다.

## 동작

- `<Providers>` 내부에서 `<App>{children}</App>` 구조를 유지합니다.
- 레이아웃 구조는 `App > Page > Section` 계층 기준을 따릅니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 루트 레이아웃 컴포넌트 네이밍을 `App`으로 통일 | codex |

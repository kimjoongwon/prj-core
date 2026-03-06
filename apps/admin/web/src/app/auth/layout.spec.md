# Auth 레이아웃 기획서

> 생성일: 2026-03-03
> 타입: layout
> 위치: apps/admin/web/src/app/auth/layout.tsx

## 역할

인증 도메인 하위 페이지를 위한 공통 구조 레이아웃입니다.
헤더/사이드 없이 `Page`로 children만 감쌉니다.

## 동작

- `"use client"` + `observer` 패턴을 유지합니다.
- `<Page className="min-h-screen">{children}</Page>` 형태로 인증 화면 최소 높이를 보장합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 규칙 위반 정리: useMemo/useCallback/useIsMounted 제거 및 observer/이벤트 네이밍 규칙 반영 | codex |
| 2026-03-03 | 인증 레이아웃 컴포넌트 네이밍을 `Page`로 통일 | codex |
| 2026-03-03 | `Page` 단일 구조 전환에 맞춰 인증 레이아웃 최소 높이(`min-h-screen`)를 명시 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |

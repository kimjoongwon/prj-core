# Auth 레이아웃 기획서

> 생성일: 2026-03-03
> 타입: layout
> 위치: apps/admin/web/src/app/auth/layout.tsx

## 역할

인증 도메인 하위 페이지를 위한 공통 구조 레이아웃입니다.
헤더/사이드 없이 `Page`로 children만 감쌉니다.

## 동작

- `"use client"` + `observer` 패턴을 유지합니다.
- `<Page>{children}</Page>` 형태로 인증 화면 공통 골격을 제공합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 인증 레이아웃 컴포넌트 네이밍을 `Page`로 통일 | codex |

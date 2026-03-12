# providers.tsx 기획서

> 생성일: 2026-03-12
> 타입: provider
> 위치: apps/introduction/src/app/providers.tsx

## 역할

소개 앱의 최상위 클라이언트 Provider를 구성합니다.
정적 페이지이므로 React Query, MobX Store, 인증 Provider 없이 HeroUI 디자인 시스템만 제공합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `Providers` | `DesignSystemProvider` + `App` 래퍼 |
| `children` | 소개 랜딩의 전체 렌더 트리 |

## 구현 체크리스트

- [x] `"use client"` 선언
- [x] `observer` 적용
- [x] `DesignSystemProvider` 연결
- [x] 불필요한 전역 상태/인증 의존성 제거

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-12 | introduction 앱 전용 최소 Provider 신규 생성 | codex |

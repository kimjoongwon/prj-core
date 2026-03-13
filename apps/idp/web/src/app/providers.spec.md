# providers ui 기획서

> 생성일: 2026-03-03
> 타입: ui
> 위치: apps/idp/web/src/app/providers.tsx

## 역할

이 파일은 ui 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| Providers | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/client | 기능 구현 의존성 |
| @cocrepo/api/idp/client | 기능 구현 의존성 |
| @cocrepo/store | ConsoleAppStoreProvider 사용 |
| @cocrepo/ui | 기능 구현 의존성 |
| @tanstack/react-query | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |
| nuqs/adapters/next/app | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | 앱 로컬 stores 대신 @cocrepo/store의 ConsoleAppStoreProvider 직접 사용으로 전환 | codex |
| 2026-03-13 | @cocrepo/api root import를 split subpath import로 전환 | codex |

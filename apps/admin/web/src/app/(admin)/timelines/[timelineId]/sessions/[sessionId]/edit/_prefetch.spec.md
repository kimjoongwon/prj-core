# _prefetch prefetch 기획서

> 생성일: 2026-03-03
> 타입: page-prefetch
> 위치: apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/edit/_prefetch.ts

## 역할

이 파일은 prefetch 계층의 보조 동작(연결/조회/조합)을 담당합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| export | 없음 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/timelines | 기능 구현 의존성 |
| @cocrepo/api/server | 기능 구현 의존성 |
| @tanstack/react-query | 기능 구현 의존성 |
| next/dist/server/web/spec-extension/adapters/request-cookies | 기능 구현 의존성 |

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-13 | `@cocrepo/api` root import를 split subpath import로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |

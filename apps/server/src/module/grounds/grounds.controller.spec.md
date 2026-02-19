# Grounds Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/server/src/module/grounds/grounds.controller.ts`

## 역할

Ground(기초 데이터) 관련 읽기 전용 API를 제공합니다. 전체 Ground 목록 조회와 현재 Space에 속한 Ground 목록 조회를 지원합니다.

## 베이스 경로

`/api/v1/grounds`

## 엔드포인트

| Method | 경로 | DTO | 반환값 | 설명 |
|--------|------|-----|--------|------|
| GET | `/` | - | `GroundDto[]` | 전체 Ground 목록 조회 |
| GET | `/my` | - | `GroundDto[]` | 내 Space의 Ground 목록 조회 (X-Space-ID 헤더 기반) |

## 인증/인가

| 엔드포인트 | 인증 필요 | 권한 |
|------------|----------|------|
| GET `/` | X (`@Public()`) | 없음 |
| GET `/my` | O (`@ApiAuth()`) | 인증된 사용자 (별도 Role 제한 없음) |

## 의존성

| 서비스 | 역할 |
|--------|------|
| `GroundsService` | Ground 전체 조회, Space별 Ground 조회 |
| `ClsService` | CLS 컨텍스트에서 SPACE_ID 추출 |

## 응답 메시지

| 엔드포인트 | 메시지 키 |
|------------|----------|
| GET `/` | `common.ground.list.success` |
| GET `/my` | `common.ground.mySpace.success` |

## 에러 응답

| 엔드포인트 | 상태 코드 | 조건 |
|------------|----------|------|
| GET `/` | 500 | 서버 에러 |
| GET `/my` | 500 | 서버 에러 |

## 특이사항

- GET `/`는 `@Public()`으로 인증 불필요
- GET `/my`는 CLS 컨텍스트에서 `CONTEXT_KEYS.SPACE_ID`로 Space ID를 추출하여 해당 Space의 Ground 조회
- FULL_ACCESS는 spaceId 없이 모든 Ground 조회 가능 (GroundsService 내부 로직)
- API 태그: `GROUNDS`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |

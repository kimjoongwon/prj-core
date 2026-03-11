# Users ApplicationService 기획서

> 생성일: 2026-03-11
> 타입: application-service
> 위치: packages/be-app/src/users.application-service.ts

## 역할

Users 컨트롤러의 Space/Auth 컨텍스트 해석과 목록 응답 메타 계산을 ApplicationService로 이동합니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| UsersService | 사용자 조회/등록/수정/삭제 수행 |
| AuthContext | 현재 인증 사용자 ID 제공 |
| SpaceContext | 현재 요청의 spaceId 제공 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| getUsers | 목록과 pagination meta/stats를 반환 |
| getUserById | 현재 Space 기준 사용자 상세 조회 |
| createUser | 현재 Space에 사용자 등록 |
| updateUser | 현재 Space 기준 사용자 수정 |
| deleteUser | 현재 Space 기준 사용자 삭제 |

## 비즈니스 규칙

- Space가 없으면 `USER_ERRORS.SPACE_NOT_SELECTED`로 거부합니다.
- 삭제 시 현재 인증 사용자 ID를 전달해 자기 자신 삭제 방지 규칙을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | Users 도메인 application service 신규 생성 및 컨텍스트 해석 이동 | codex |

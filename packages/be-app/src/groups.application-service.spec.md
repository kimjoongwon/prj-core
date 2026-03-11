# Groups ApplicationService 기획서

> 생성일: 2026-03-11
> 타입: application-service
> 위치: packages/be-app/src/groups.application-service.ts

## 역할

Group 컨트롤러에서 SpaceContext 직접 의존을 제거하고 현재 Space 기준 생성 흐름을 ApplicationService로 위임합니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| GroupsService | Group CRUD 수행 |
| SpaceContext | 현재 요청의 spaceId 제공 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| getGroups | QueryGroupDto 기반 목록 조회 |
| getGroupById | Group 상세 조회 |
| createGroup | 현재 spaceId를 주입해 Group 생성 |
| updateGroup | Group 수정 |
| deleteGroup | Group 삭제 |

## 비즈니스 규칙

- Group 생성은 항상 현재 요청 Space 기준으로 수행됩니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | Groups 도메인 thin wrapper application service 신규 생성 | codex |

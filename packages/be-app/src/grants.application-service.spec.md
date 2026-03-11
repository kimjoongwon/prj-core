# Grants ApplicationService 기획서

> 생성일: 2026-03-11
> 타입: application-service
> 위치: packages/be-app/src/grants.application-service.ts

## 역할

Grant 컨트롤러가 `BatchGrantRequestDto` 해석과 Role 단건 조회 인자를 직접 다루지 않도록 ApplicationService에서 얇게 감쌉니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| GrantsService | Grant 배치 할당 및 Role별 조회 수행 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| batchAssignGrantsToRole | DTO의 grants 배열을 Role 배치 할당 입력으로 전달 |
| getGrantsByRoleId | 단일 roleId를 Service의 배열 인자로 변환 |

## 비즈니스 규칙

- 배치 할당은 전체 동기화 방식으로 Service 규칙을 그대로 따릅니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | Grants 도메인 thin wrapper application service 신규 생성 | codex |

# Grants Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/core/api/src/module/grants/grants.controller.ts`

## 역할

Grant 배치 할당과 Role별 조회 API를 노출하며, DTO 해석과 Role 단건 인자 변환은 `GrantsApplicationService`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| grantsApplicationService | GrantsApplicationService | Grant 배치 할당 및 Role별 조회 유즈케이스 |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| PUT | `/roles/:roleId` | `batchAssignGrantsToRole` | Role별 Grant 전체 동기화 |
| GET | `/roles/:roleId` | `getGrantsByRoleId` | Role별 Grant 목록 조회 |

## 비즈니스 메모

- `BatchGrantRequestDto.grants` 해석은 ApplicationService가 담당합니다.
- controller는 단일 `roleId`를 그대로 전달하고 배열 변환은 하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Controller 의존성을 GrantsApplicationService로 전환 | codex |

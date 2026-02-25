# Grants Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/server/src/module/grant/grants.controller.ts`

## 역할

Grant(권한 부여) 관련 API를 제공합니다. Role에 Ability를 배치로 할당/해제하거나, 특정 Role에 할당된 Grant 목록을 조회합니다.

## 베이스 경로

`/api/v1/grants`

## 엔드포인트

| Method | 경로 | DTO | 반환값 | 설명 |
|--------|------|-----|--------|------|
| PUT | `/roles/:roleId` | Param: `roleId` (UUID), Body: `BatchGrantRequestDto` | `GrantResponseDto[]` | 역할별 권한 배치 할당 (전체 목록 동기화 방식) |
| GET | `/roles/:roleId` | Param: `roleId` (UUID) | `GrantResponseDto[]` | 역할별 권한 조회 |

## 인증/인가

| 엔드포인트 | 인증 필요 | 권한 |
|------------|----------|------|
| PUT `/roles/:roleId` | O | FULL_ACCESS (`@Roles`, `RolesGuard`) |
| GET `/roles/:roleId` | O | MANAGE 또는 FULL_ACCESS (`@Roles`, `RolesGuard`) |

## 의존성

| 서비스 | 역할 |
|--------|------|
| `GrantsService` | Grant 배치 할당, Role별 Grant 조회 |

## 응답 메시지

| 엔드포인트 | 메시지 키 |
|------------|----------|
| PUT `/roles/:roleId` | `common.grant.batchAssign.success` |
| GET `/roles/:roleId` | `common.grant.byRole.success` |

## 에러 응답

| 엔드포인트 | 상태 코드 | 조건 |
|------------|----------|------|
| PUT `/roles/:roleId` | 400, 401, 403, 404, 500 | 유효성/인증/권한/미존재/서버 에러 |
| GET `/roles/:roleId` | 401, 403, 500 | 인증/권한/서버 에러 |

## 특이사항

- 배치 할당은 전체 목록 동기화 방식 (기존 Grant를 모두 교체)
- `ParseUUIDPipe`로 roleId 파라미터 UUID 유효성 검증
- GET 조회는 MANAGE 이상 권한으로 접근 가능
- PUT 할당은 FULL_ACCESS만 가능
- API 태그: `GRANTS`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |

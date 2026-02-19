# Grounds Controller 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-19
> 타입: controller
> 위치: `apps/server/src/module/grounds/grounds.controller.ts`

## 역할

Ground(시설) 관련 REST API를 제공합니다. 목록 조회(공개/인증)와 CRUD 전체를 지원합니다.

## 베이스 경로

`/api/v1/grounds`

## 엔드포인트

| Method | 경로 | DTO | 반환값 | 설명 |
|--------|------|-----|--------|------|
| GET | `/` | - | `GroundDto[]` | 전체 Ground 목록 조회 (공개) |
| GET | `/my` | - | `GroundDto[]` | 내 Space의 Ground 목록 조회 |
| GET | `/:groundId` | - | `GroundDto` | Ground 단건 조회 |
| POST | `/` | `CreateGroundDto` | `GroundDto` | Ground 등록 (Space 자동 생성) |
| PATCH | `/:groundId` | `UpdateGroundDto` | `GroundDto` | Ground 정보 수정 (businessNo 제외) |
| DELETE | `/:groundId` | - | (204) | Ground 소프트 삭제 |

## 인증/인가

| 엔드포인트 | 인증 필요 | 권한 |
|------------|----------|------|
| GET `/` | X (`@Public()`) | 없음 |
| GET `/my` | O (`@ApiAuth()`) | 인증된 사용자 |
| GET `/:groundId` | O (`@ApiAuth()`) | 인증된 사용자 |
| POST `/` | O (`@ApiAuth()`) | FULL_ACCESS (RolesGuard) |
| PATCH `/:groundId` | O (`@ApiAuth()`) | FULL_ACCESS (RolesGuard) |
| DELETE `/:groundId` | O (`@ApiAuth()`) | FULL_ACCESS (RolesGuard) |

## 의존성

| 서비스 | 역할 |
|--------|------|
| `GroundsService` | Ground CRUD 비즈니스 로직 |
| `ClsService` | CLS 컨텍스트에서 SPACE_ID 추출 |

## 응답 메시지

| 엔드포인트 | 메시지 키 |
|------------|----------|
| GET `/` | `common.ground.list.success` |
| GET `/my` | `common.ground.mySpace.success` |
| GET `/:groundId` | `common.ground.get.success` |
| POST `/` | `common.ground.create.success` |
| PATCH `/:groundId` | `common.ground.update.success` |
| DELETE `/:groundId` | `common.ground.delete.success` |

## 에러 응답

| 엔드포인트 | 상태 코드 | 조건 |
|------------|----------|------|
| GET `/:groundId` | 404 | Ground 없음 |
| POST `/` | 409 | 사업자등록번호 중복 |
| PATCH `/:groundId` | 404 | Ground 없음 |
| DELETE `/:groundId` | 404 | Ground 없음 |

## CreateGroundDto 필드

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | string | O | 시설명 |
| label | string? | X | 단축 라벨 |
| address | string | O | 주소 |
| phone | string | O | 전화번호 |
| email | string | O | 이메일 |
| businessNo | string | O | 사업자등록번호 (유니크) |
| logoImageFileId | string? | X | 로고 이미지 파일 ID |
| imageFileId | string? | X | 대표 이미지 파일 ID |

## UpdateGroundDto 필드

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | string? | X | 시설명 |
| label | string? | X | 단축 라벨 |
| address | string? | X | 주소 |
| phone | string? | X | 전화번호 |
| email | string? | X | 이메일 |
| logoImageFileId | string? | X | 로고 이미지 파일 ID |
| imageFileId | string? | X | 대표 이미지 파일 ID |
| ~~businessNo~~ | - | - | **제외 (변경 불가)** |

## 특이사항

- GET `/`는 `@Public()`으로 인증 불필요 (헬스체크, 공개 정보 조회 등에 활용)
- GET `/my`는 CLS 컨텍스트에서 `CONTEXT_KEYS.SPACE_ID`로 Space ID를 추출하여 해당 Space의 Ground 조회
- POST `/`는 Ground 등록 시 서버에서 새 Space를 자동 생성
- PATCH `/:groundId`는 `businessNo` 필드를 UpdateGroundDto에서 제외하여 변경 방지
- DELETE는 소프트 삭제 (removedAt 설정), 204 응답
- API 태그: `GROUNDS`

## 구현 체크리스트

- [x] GET `/` (getGrounds)
- [x] GET `/my` (getMyGrounds)
- [x] GET `/:groundId` (getGround)
- [x] POST `/` (createGround)
- [x] PATCH `/:groundId` (updateGround)
- [x] DELETE `/:groundId` (removeGround)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) - GET 2개 | req-reverse-engineer |
| 2026-02-19 | CRUD 엔드포인트 추가 (GET단건/POST/PATCH/DELETE), 인가 권한 명시, DTO 필드 정의 | be-spec-planner |
| 2026-02-19 | CRUD 전체 구현 완료 - be-service-builder | be-service-builder |

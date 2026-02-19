# Grounds Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/grounds.service.ts

## 역할

Ground(시설) 도메인의 비즈니스 로직을 담당하는 서비스입니다. Ground 등록 시 Space를 자동 생성하며, 사업자등록번호 중복 검증, businessNo 변경 방지 등 도메인 규칙을 적용합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `GroundsRepository` | Ground CRUD 데이터 접근 |
| `SpacesService` | Ground 등록 시 Space 자동 생성 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getAll` | - | `Promise<Ground[]>` | 모든 Ground 목록 조회 |
| `getById` | `id: string` | `Promise<Ground>` | ID로 Ground 조회 (없으면 NotFoundException) |
| `getMyGrounds` | `spaceId: string \| undefined` | `Promise<Ground[]>` | 내 Space의 Ground 목록 조회 (FULL_ACCESS이면 전체) |
| `createGround` | `CreateGroundDto` | `Promise<Ground>` | 시설 등록 + Space 자동 생성 |
| `updateGround` | `id: string, UpdateGroundDto` | `Promise<Ground>` | 시설 정보 수정 (businessNo 제외) |
| `removeGround` | `id: string` | `Promise<void>` | 소프트 삭제 |

## 비즈니스 규칙

- **Space 자동 생성**: `createGround()` 호출 시 새 Space를 먼저 생성한 뒤, Ground에 `spaceId` 연결
- **사업자등록번호 중복 방지**: `createGround()` 시 `findByBusinessNo()`로 중복 검증 → `ConflictException`
- **businessNo 불변**: `updateGround()`에서 `businessNo` 필드를 무시/제외 처리
- **존재 검증**: `getById()`, `updateGround()`, `removeGround()` 시 Ground 존재 여부 확인 → `NotFoundException`
- **FULL_ACCESS 전체 조회**: `getMyGrounds(spaceId: undefined)`이면 전체 Ground 반환
- **트랜잭션**: `createGround()`는 `@Transactional()` 데코레이터로 Space + Ground 생성 원자성 보장

## 에러 처리

| 상황 | 예외 | 코드 |
|------|------|------|
| Ground 없음 | `NotFoundException` | 404 |
| 사업자등록번호 중복 | `ConflictException` | 409 |

## 권한 요구사항

- Controller 레이어에서 Guard를 통해 권한 처리
- `createGround`, `updateGround`, `removeGround`는 FULL_ACCESS 전용 (RolesGuard)
- `getAll`, `getById`, `getMyGrounds`는 인증된 사용자 가능

## 구현 체크리스트

- [x] grounds.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록
- [x] `createGround()` 구현 (Space 자동 생성 포함, @Transactional)
- [x] `updateGround()` 구현 (businessNo 제외)
- [x] `removeGround()` 구현
- [x] 사업자등록번호 중복 검증 로직

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | CRUD 전체 메서드 추가, 비즈니스 규칙 상세화, Space 자동 생성 명시, 에러 처리 추가 | be-spec-planner |
| 2026-02-19 | CRUD 전체 구현 완료 - be-service-builder | be-service-builder |

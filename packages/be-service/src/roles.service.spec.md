# Roles Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/roles.service.ts

## 역할

시스템 역할(Role)을 관리합니다.
시스템 역할(FULL_ACCESS, MANAGE, VIEW)은 수정/삭제가 불가능합니다.
연결된 테넌트가 있는 역할은 삭제가 불가능합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `RolesRepository` | 역할 CRUD |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getById` | `id: string` | `Promise<Role \| null>` | ID로 역할 조회 |
| `getDefaultUserRole` | - | `Promise<Role \| null>` | 기본 사용자 역할(VIEW) 조회 |
| `getAll` | - | `Promise<Role[]>` | 전체 역할 목록 조회 |
| `create` | `dto: CreateRoleDto` | `Promise<Role>` | 역할 생성 |
| `update` | `id: string, dto: UpdateRoleDto` | `Promise<Role>` | 역할 수정 |
| `delete` | `id: string` | `Promise<Role>` | 역할 삭제 |

## 비즈니스 규칙

- **시스템 역할 보호**: `isSystem: true` 인 역할은 수정/삭제 불가
- **이름 unique**: 역할 이름 중복 불가
- **삭제 제한**: 연결된 테넌트가 있으면 삭제 거부
- 사용자 생성 역할은 항상 `isSystem: false`
- `getDefaultUserRole`: 회원가입 시 기본 역할 조회 (SYSTEM_ROLES.VIEW)
- `UpdateRoleDto`: name 수정 불가 (DTO에서 제외됨)

## 에러 처리

| 에러 상황 | 에러 타입 | 메시지 |
|----------|-----------|--------|
| 역할 없음 | `NotFoundException` | "역할을 찾을 수 없습니다" |
| 이름 중복 | `ConflictException` | "이미 존재하는 역할 이름입니다: {name}" |
| 시스템 역할 수정 시도 | `ForbiddenException` | "시스템 역할은 수정할 수 없습니다" |
| 시스템 역할 삭제 시도 | `ForbiddenException` | "시스템 역할은 삭제할 수 없습니다" |
| 테넌트 연결된 역할 삭제 | `BadRequestException` | "이 역할에 {N}명의 사용자가 연결되어 있습니다..." |

## 권한 요구사항

- Controller 레이어에서 Guard를 통해 권한 처리

## 구현 체크리스트

- [x] roles.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |

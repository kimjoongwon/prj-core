# Folder Entity 기획서

> 생성일: 2026-02-22
> 타입: entity
> 위치: packages/be-entity/src/folder.entity.ts

## 역할

에셋의 계층적 저장 구조를 관리하는 폴더 엔티티입니다. 자기 참조 관계를 통해 트리 구조를 형성합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| spaceId | UUID | FK, required | - | 소속 Space ID |
| parentFolderId | UUID | FK, optional | - | 상위 폴더 ID (null이면 루트) |
| name | String | required | - | 폴더명 |
| path | String | required, unique | - | 전체 경로 (예: /이미지/배너) |
| sortOrder | Int | required | 0 | 정렬 순서 |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |
| removedAt | DateTime | optional | - | 삭제 일시 (소프트 삭제) |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | Space | N:1 | 소속 Space |
| belongsTo | Folder | N:0..1 | 상위 폴더 (자기 참조) |
| hasMany | Folder | 1:N | 하위 폴더들 (자기 참조) |
| hasMany | Asset | 1:N | 폴더 내 에셋들 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isRoot() | boolean | 루트 폴더 여부 확인 |
| getDepth() | number | 폴더 깊이 계산 (path 기준) |
| updatePath(newParentPath: string) | void | 상위 폴더 변경 시 path 갱신 |
| isDescendantOf(folderId: string) | boolean | 특정 폴더의 하위 폴더인지 확인 |
| softDelete() | void | 소프트 삭제 수행 |

## 비즈니스 규칙

- 순환 참조 금지: 자기 자신 또는 자신의 하위 폴더를 상위 폴더로 설정 불가
- 같은 상위 폴더 내에서 이름 중복 불가
- path는 Space 내에서 유니크
- 소프트 삭제 시 하위 에셋들도 함께 고려 필요
- 루트 폴더는 parentFolderId가 null

## 구현 체크리스트

- [ ] folder.entity.ts
- [ ] AbstractEntity 상속
- [ ] Prisma 타입 implements
- [ ] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 도메인 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| isRoot() | 1 | 0 | 1 | 2 |
| getDepth() | 2 | 0 | 0 | 2 |
| isDescendantOf() | 2 | 0 | 1 | 3 |

### [TC-001] isRoot() - 루트 폴더

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | parentFolderId가 null인 Folder |
| **When** | isRoot() 호출 |
| **Then** | true 반환 |

### [TC-002] isRoot() - 하위 폴더

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | parentFolderId가 존재하는 Folder |
| **When** | isRoot() 호출 |
| **Then** | false 반환 |

### [TC-003] getDepth() - 루트

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | path가 "/"인 Folder |
| **When** | getDepth() 호출 |
| **Then** | 0 반환 |

### [TC-004] getDepth() - 2단계 깊이

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | path가 "/이미지/배너"인 Folder |
| **When** | getDepth() 호출 |
| **Then** | 2 반환 |

### [TC-005] isDescendantOf() - 직접 하위

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | path가 "/이미지/배너"인 Folder |
| **When** | isDescendantOf("/이미지" 폴더의 id) 호출 |
| **Then** | true 반환 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.context.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |

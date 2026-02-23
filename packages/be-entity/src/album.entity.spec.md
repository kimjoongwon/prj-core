# Album Entity 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-23
> 타입: entity
> 위치: packages/be-entity/src/album.entity.ts

## 역할

사용자 정의 에셋 컬렉션인 앨범을 관리합니다. 폴더와 분리된 독립적인 분류 체계로, 에셋을 다양한 목적으로 그룹화할 수 있습니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| spaceId | UUID | FK, required | - | 소속 Space ID |
| name | String | required | - | 앨범명 |
| description | String | optional | - | 앨범 설명 |
| coverAssetId | UUID | FK, optional | - | 커버 이미지 Asset ID |
| sortOrder | Int | required | 0 | 정렬 순서 |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |
| removedAt | DateTime | optional | - | 삭제 일시 (소프트 삭제) |
| creatorId | UUID | FK, optional | - | 생성자 ID |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | Space | N:1 | 소속 Space |
| hasOne | Asset | 0..1:1 | 커버 이미지 (coverAsset) |
| belongsTo | User | 0..1:1 | 생성자 (creator) |
| hasMany | AlbumEntry | 1:N | 앨범에 포함된 에셋 엔트리들 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| hasCover() | boolean | 커버 이미지가 설정되어 있는지 확인합니다 |
| getEntryCount() | number | 앨범에 포함된 엔트리 수를 반환합니다 |
| getAssetCount() | number | @deprecated getEntryCount()를 사용하세요 |

## 비즈니스 규칙

- 앨범명은 Space 내에서 유니크
- 커버 이미지는 선택사항
- 앨범 삭제 시 연결된 AlbumEntry도 함께 삭제 (Cascade)
- 소프트 삭제 정책 적용 (removedAt 필드 사용)

## 구현 체크리스트

- [x] album.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma 타입 implements
- [x] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 도메인 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| hasCover() | 1 | 0 | 1 | 2 |
| getEntryCount() | 1 | 0 | 1 | 2 |

### [TC-001] hasCover() - 커버 이미지 있음

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | coverAssetId가 설정된 Album 인스턴스 |
| **When** | hasCover() 호출 |
| **Then** | true 반환 |

### [TC-002] hasCover() - 커버 이미지 없음

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | coverAssetId가 null인 Album 인스턴스 |
| **When** | hasCover() 호출 |
| **Then** | false 반환 |

### [TC-003] getEntryCount() - 엔트리 있음

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | entries 배열이 있는 Album 인스턴스 |
| **When** | getEntryCount() 호출 |
| **Then** | entries.length 반환 |

### [TC-004] getEntryCount() - 엔트리 없음

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | entries가 undefined인 Album 인스턴스 |
| **When** | getEntryCount() 호출 |
| **Then** | 0 반환 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
| 2026-02-23 | 도메인 메서드 정리 (hasCover, getEntryCount 추가) | be-entity-builder |

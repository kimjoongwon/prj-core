# Album Entity 기획서

> 생성일: 2026-02-22
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

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | Space | N:1 | 소속 Space |
| hasOne | Asset | 0..1:1 | 커버 이미지 |
| hasMany | AlbumEntry | 1:N | 앨범에 포함된 에셋 엔트리들 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| getAssetCount() | number | 앨범에 포함된 에셋 수 반환 |
| setCover(assetId: string) | void | 커버 이미지 설정 |
| clearCover() | void | 커버 이미지 제거 |
| softDelete() | void | 소프트 삭제 수행 |

## 비즈니스 규칙

- 앨범명은 Space 내에서 유니크
- 커버 이미지는 선택사항
- 앨범 삭제 시 연결된 AlbumEntry도 함께 삭제 (Cascade)
- 소프트 삭제 정책 적용

## 구현 체크리스트

- [ ] album.entity.ts
- [ ] AbstractEntity 상속
- [ ] Prisma 타입 implements
- [ ] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 도메인 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| getAssetCount() | 1 | 0 | 1 | 2 |
| setCover() | 1 | 0 | 0 | 1 |
| clearCover() | 1 | 0 | 0 | 1 |

### [TC-001] setCover()

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | coverAssetId가 null인 Album |
| **When** | setCover(assetId) 호출 |
| **Then** | coverAssetId가 설정됨 |

### [TC-002] clearCover()

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | coverAssetId가 설정된 Album |
| **When** | clearCover() 호출 |
| **Then** | coverAssetId가 null이 됨 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |

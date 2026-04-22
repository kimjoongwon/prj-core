# AlbumEntry Entity 기획서

> 생성일: 2026-02-22
> 타입: entity
> 위치: packages/be-entity/src/album-entry.entity.ts

## 역할

앨범과 에셋의 N:M 관계를 관리하는 조인 엔티티입니다. DDD 용어를 사용하여 AlbumEntry로 명명하며, 순서와 캡션 정보를 포함합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| spaceId | UUID | FK, required | - | 소속 Space ID |
| albumId | UUID | FK, required | - | 앨범 ID |
| assetId | UUID | FK, required | - | 에셋 ID |
| position | Int | required | - | 앨범 내 순서 |
| caption | String | optional | - | 에셋 캡션 |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |
| removedAt | DateTime | optional | - | 삭제 일시 (소프트 삭제) |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | Space | N:1 | 소속 Space |
| belongsTo | Album | N:1 | 소속 앨범 |
| belongsTo | Asset | N:1 | 연결된 에셋 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| updateCaption(caption: string) | void | 캡션 업데이트 |
| updatePosition(position: number) | void | 순서 변경 |
| softDelete() | void | 소프트 삭제 수행 |

## 비즈니스 규칙

- 동일한 앨범에 동일한 에셋 중복 추가 불가 (albumId + assetId unique)
- position은 앨범 내에서 유니크
- 앨범/에셋 삭제 시 연결된 AlbumEntry도 함께 삭제 (Cascade)
- 소프트 삭제 정책 적용

## 구현 체크리스트

- [ ] album-entry.entity.ts
- [ ] AbstractEntity 상속
- [ ] Prisma 타입 implements
- [ ] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 도메인 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| updateCaption() | 1 | 0 | 1 | 2 |
| updatePosition() | 1 | 0 | 0 | 1 |

### [TC-001] updateCaption()

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | caption이 null인 AlbumEntry |
| **When** | updateCaption("새 캡션") 호출 |
| **Then** | caption이 "새 캡션"으로 설정됨 |

### [TC-002] updateCaption() - 빈 문자열

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | caption이 있는 AlbumEntry |
| **When** | updateCaption("") 호출 |
| **Then** | caption이 빈 문자열로 설정됨 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.context.md`
- `packages/be-entity/src/album.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |

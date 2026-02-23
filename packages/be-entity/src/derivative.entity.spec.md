# Derivative Entity 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-23
> 타입: entity
> 위치: packages/be-entity/src/derivative.entity.ts

## 역할

에셋의 파생 리소스(썸네일, 프리뷰, 트랜스코딩 등)를 관리합니다. 하나의 원본 에셋에서 여러 파생 리소스가 생성될 수 있습니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| spaceId | UUID | FK, required | - | 소속 Space ID |
| assetId | UUID | FK, required | - | 원본 Asset ID |
| kind | DerivativeKind | required | - | 파생 리소스 종류 |
| profile | String | required | "default" | 변환 프로필명 |
| storageKey | String | required, unique | - | 스토리지 키 |
| mimeType | String | required | - | MIME 타입 |
| sizeBytes | BigInt | required | - | 파일 크기 (bytes) |
| width | Int | optional | - | 너비 (이미지/비디오) |
| height | Int | optional | - | 높이 (이미지/비디오) |
| durationMs | Int | optional | - | 재생 시간 (비디오 트랜스코딩) |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |
| removedAt | DateTime | optional | - | 삭제 일시 (소프트 삭제) |

## Enum

### DerivativeKind

| 값 | 설명 |
|-----|------|
| THUMBNAIL | 썸네일 이미지 (작은 크기) |
| PREVIEW | 프리뷰 이미지/비디오 (중간 크기) |
| TRANSCODE | 트랜스코딩된 비디오 (다른 포맷/해상도) |
| TEXT | 추출된 텍스트 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | Space | N:1 | 소속 Space |
| belongsTo | Asset | N:1 | 원본 Asset (onDelete: Cascade) |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isImage() | boolean | 이미지 파일인지 확인 (MIME 타입 기반) |
| isVideo() | boolean | 비디오 파일인지 확인 (MIME 타입 기반) |
| isThumbnail() | boolean | 썸네일 여부 확인 |
| isPreview() | boolean | 프리뷰 여부 확인 |
| isTranscode() | boolean | 트랜스코딩 여부 확인 |
| isText() | boolean | 텍스트 추출물 여부 확인 |
| getHumanReadableSize() | string | 사람이 읽기 쉬운 크기 반환 |
| getResolution() | string \| null | 해상도 문자열 반환 (예: "1920x1080") |
| getResolutionLabel() | string \| null | 해상도 라벨 반환 (SD, HD, Full HD, 4K 등) |

## 비즈니스 규칙

- 동일한 Asset + kind + profile 조합은 유니크
- storageKey는 Space 내에서 유니크
- Asset 삭제 시 연결된 Derivative도 함께 삭제 (Cascade)
- 소프트 삭제 정책 적용

## 구현 체크리스트

- [x] derivative.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma 타입 implements
- [x] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 도메인 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| isImage() | 1 | 0 | 1 | 2 |
| isVideo() | 1 | 0 | 1 | 2 |
| isThumbnail/Preview/Transcode/Text() | 4 | 0 | 0 | 4 |
| getHumanReadableSize() | 2 | 0 | 0 | 2 |
| getResolution() | 1 | 0 | 1 | 2 |
| getResolutionLabel() | 5 | 0 | 2 | 7 |

### [TC-001] isImage()

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | mimeType="image/jpeg"인 Derivative |
| **When** | isImage() 호출 |
| **Then** | true 반환 |

### [TC-002] isVideo()

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | mimeType="video/mp4"인 Derivative |
| **When** | isVideo() 호출 |
| **Then** | true 반환 |

### [TC-003] getHumanReadableSize()

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | sizeBytes=51200인 Derivative |
| **When** | getHumanReadableSize() 호출 |
| **Then** | "50 KB" 반환 |

### [TC-004] getResolutionLabel() - 4K

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | width=3840, height=2160인 Derivative |
| **When** | getResolutionLabel() 호출 |
| **Then** | "4K" 반환 |

### [TC-005] getResolutionLabel() - Full HD

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | width=1920, height=1080인 Derivative |
| **When** | getResolutionLabel() 호출 |
| **Then** | "Full HD" 반환 |

### [TC-006] getResolutionLabel() - null

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | width=null, height=null인 Derivative |
| **When** | getResolutionLabel() 호출 |
| **Then** | null 반환 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`
- `packages/be-entity/src/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
| 2026-02-23 | isImage, isVideo, getResolution, getResolutionLabel 메서드 추가 | entity-builder |

# Image Entity 기획서

> 생성일: 2026-02-22
> 타입: entity
> 위치: packages/be-entity/src/image.entity.ts

## 역할

Asset의 CTI(Class Table Inheritance) 서브타입으로, 이미지 타입 에셋의 상세 정보를 관리합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| assetId | UUID | PK, FK, required | - | 부모 Asset ID |
| spaceId | UUID | FK, required | - | 소속 Space ID |
| width | Int | required | - | 이미지 너비 (px) |
| height | Int | required | - | 이미지 높이 (px) |
| colorSpace | String | optional | - | 색상 공간 (sRGB, Adobe RGB 등) |
| exif | Json | optional | - | EXIF 메타데이터 |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | Asset | 1:1 | 부모 Asset (onDelete: Cascade) |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| getAspectRatio() | number | 가로세로 비율 반환 (width / height) |
| isLandscape() | boolean | 가로 방향 여부 |
| isPortrait() | boolean | 세로 방향 여부 |
| getResolution() | string | 해상도 문자열 반환 (예: "1920x1080") |
| getMegapixels() | number | 메가픽셀 수 반환 |
| getExifField(field: string) | any | 특정 EXIF 필드 값 반환 |

## 비즈니스 규칙

- Image 레코드는 부모 Asset의 kind가 IMAGE인 경우에만 존재
- Asset 삭제 시 연결된 Image도 함께 삭제 (Cascade)
- width, height는 0보다 커야 함

## 구현 체크리스트

- [ ] image.entity.ts
- [ ] AbstractEntity 상속
- [ ] Prisma 타입 implements
- [ ] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 도메인 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| getAspectRatio() | 2 | 0 | 1 | 3 |
| isLandscape/Portrait() | 2 | 0 | 0 | 2 |
| getResolution() | 1 | 0 | 0 | 1 |
| getMegapixels() | 1 | 0 | 0 | 1 |

### [TC-001] getAspectRatio() - 가로 방향

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | width=1920, height=1080인 Image |
| **When** | getAspectRatio() 호출 |
| **Then** | 1.78 (16:9) 반환 |

### [TC-002] getAspectRatio() - 세로 방향

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | width=1080, height=1920인 Image |
| **When** | getAspectRatio() 호출 |
| **Then** | 0.56 (9:16) 반환 |

### [TC-003] isLandscape() - 가로 방향

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | width=1920, height=1080인 Image |
| **When** | isLandscape() 호출 |
| **Then** | true 반환 |

### [TC-004] getMegapixels()

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | width=4000, height=3000인 Image |
| **When** | getMegapixels() 호출 |
| **Then** | 12 반환 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.context.md`
- `packages/be-entity/src/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |

# Video Entity 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-23
> 타입: entity
> 위치: packages/be-entity/src/video.entity.ts

## 역할

Asset의 CTI(Class Table Inheritance) 서브타입으로, 비디오 타입 에셋의 상세 정보를 관리합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |
| removedAt | DateTime | nullable | null | 삭제 일시 |
| assetId | UUID | unique, FK, required | - | 부모 Asset ID |
| width | Int | required | - | 비디오 너비 (px) |
| height | Int | required | - | 비디오 높이 (px) |
| durationMs | Int | required | - | 재생 시간 (밀리초) |
| frameRate | Float | nullable | null | 프레임 레이트 (fps) |
| codec | String | nullable | null | 비디오 코덱 (H.264, H.265 등) |
| bitrate | Int | nullable | null | 비트레이트 (bps) |
| hasAudio | Boolean | required | false | 오디오 포함 여부 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| asset | Asset | 1:1 | 부모 Asset (onDelete: Cascade) |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| getDurationFormatted() | string | 포맷된 재생 시간 반환 (예: "02:30") |
| getDurationSeconds() | number | 재생 시간을 초 단위로 반환 |
| getResolution() | string | 해상도 문자열 반환 (예: "1920x1080") |
| getAspectRatio() | number | 가로세로 비율 반환 |
| getResolutionLabel() | string | 해상도 라벨 반환 (예: "1080p", "4K") |
| isHD() | boolean | HD(720p) 이상 여부 |
| isFullHD() | boolean | Full HD(1080p) 여부 |
| is4K() | boolean | 4K 여부 |

## 비즈니스 규칙

- Video 레코드는 부모 Asset의 kind가 VIDEO인 경우에만 존재
- Asset 삭제 시 연결된 Video도 함께 삭제 (Cascade)
- width, height는 0보다 커야 함
- durationMs는 0 이상이어야 함

## 구현 체크리스트

- [x] video.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma 타입 implements
- [x] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 도메인 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| getDurationFormatted() | 3 | 0 | 0 | 3 |
| getDurationSeconds() | 1 | 0 | 0 | 1 |
| getResolution() | 1 | 0 | 0 | 1 |
| getAspectRatio() | 1 | 0 | 1 | 2 |
| getResolutionLabel() | 6 | 0 | 1 | 7 |
| isHD() | 1 | 0 | 0 | 1 |
| isFullHD() | 1 | 0 | 0 | 1 |
| is4K() | 1 | 0 | 0 | 1 |

### [TC-001] getDurationFormatted() - 1분 미만

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | durationMs=45000 (45초)인 Video |
| **When** | getDurationFormatted() 호출 |
| **Then** | "00:45" 반환 |

### [TC-002] getDurationFormatted() - 1분 이상

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | durationMs=150000 (2분 30초)인 Video |
| **When** | getDurationFormatted() 호출 |
| **Then** | "02:30" 반환 |

### [TC-003] getDurationFormatted() - 1시간 이상

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | durationMs=3720000 (1시간 2분)인 Video |
| **When** | getDurationFormatted() 호출 |
| **Then** | "01:02:00" 반환 |

### [TC-004] getResolutionLabel() - 해상도별 라벨

**분류:** Happy Path

| height | 기대 결과 |
|--------|----------|
| 2160 | "4K" |
| 1440 | "2K" |
| 1080 | "1080p" |
| 720 | "720p" |
| 480 | "480p" |
| 360 | "360p" |

### [TC-005] getResolutionLabel() - 낮은 해상도

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | height=240인 Video |
| **When** | getResolutionLabel() 호출 |
| **Then** | "240p" 반환 |

### [TC-006] isFullHD()

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | width=1920, height=1080인 Video |
| **When** | isFullHD() 호출 |
| **Then** | true 반환 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`
- `packages/be-entity/src/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
| 2026-02-23 | 필드 구조 실제 Prisma 스키마에 맞게 업데이트 | entity-builder |
| 2026-02-23 | getResolutionLabel() 메서드 추가 | entity-builder |

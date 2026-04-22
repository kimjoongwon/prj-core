# Video Entity 기획서

> 생성일: 2026-02-22
> 타입: entity
> 위치: packages/be-entity/src/video.entity.ts

## 역할

Asset의 CTI(Class Table Inheritance) 서브타입으로, 비디오 타입 에셋의 상세 정보를 관리합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| assetId | UUID | PK, FK, required | - | 부모 Asset ID |
| spaceId | UUID | FK, required | - | 소속 Space ID |
| durationMs | Int | required | - | 재생 시간 (밀리초) |
| width | Int | optional | - | 비디오 너비 (px) |
| height | Int | optional | - | 비디오 높이 (px) |
| frameRate | Decimal | optional | - | 프레임 레이트 (fps) |
| codec | String | optional | - | 비디오 코덱 (H.264, H.265 등) |
| bitRateKbps | Int | optional | - | 비트레이트 (kbps) |
| hasAudio | Boolean | required | false | 오디오 포함 여부 |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | Asset | 1:1 | 부모 Asset (onDelete: Cascade) |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| getDurationFormatted() | string | 포맷된 재생 시간 반환 (예: "02:30") |
| getDurationSeconds() | number | 재생 시간을 초 단위로 반환 |
| getResolution() | string | 해상도 문자열 반환 (예: "1920x1080") |
| getAspectRatio() | number | 가로세로 비율 반환 |
| isHD() | boolean | HD(720p) 이상 여부 |
| isFullHD() | boolean | Full HD(1080p) 여부 |
| is4K() | boolean | 4K 여부 |

## 비즈니스 규칙

- Video 레코드는 부모 Asset의 kind가 VIDEO인 경우에만 존재
- Asset 삭제 시 연결된 Video도 함께 삭제 (Cascade)
- durationMs는 0보다 커야 함

## 구현 체크리스트

- [ ] video.entity.ts
- [ ] AbstractEntity 상속
- [ ] Prisma 타입 implements
- [ ] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 도메인 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| getDurationFormatted() | 3 | 0 | 0 | 3 |
| getDurationSeconds() | 1 | 0 | 0 | 1 |
| isHD/isFullHD/is4K() | 3 | 0 | 0 | 3 |

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

### [TC-004] isFullHD()

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | width=1920, height=1080인 Video |
| **When** | isFullHD() 호출 |
| **Then** | true 반환 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.context.md`
- `packages/be-entity/src/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |

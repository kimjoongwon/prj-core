# CreateDerivativeDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/derivative/create-derivative.dto.ts

## 역할

에셋의 파생 리소스(썸네일, 프리뷰, 트랜스코딩 등)를 생성할 때 사용하는 DTO입니다. 이미지/비디오 처리 완료 후 호출됩니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| assetId | string | required, UUID | - | 원본 Asset ID |
| kind | DerivativeKind | required, enum | - | 파생 리소스 종류 |
| profile | string | optional, max 50자 | "default" | 변환 프로필명 |
| storageKey | string | required, max 500자 | - | 스토리지 키 |
| mimeType | string | required, max 100자 | - | MIME 타입 |
| sizeBytes | number | required, integer, min 0 | - | 파일 크기 (bytes) |
| width | number | optional, integer, min 1 | - | 너비 (이미지/비디오) |
| height | number | optional, integer, min 1 | - | 높이 (이미지/비디오) |
| durationMs | number | optional, integer, min 0 | - | 재생 시간 (비디오 트랜스코딩) |

## 검증 규칙

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| assetId | 필수 값 | "원본 에셋 ID가 필요합니다" |
| assetId | UUID 형식 | "에셋 ID가 올바르지 않습니다" |
| kind | Enum 값 (THUMBNAIL/PREVIEW/TRANSCODE/TEXT) | "파생 리소스 종류가 올바르지 않습니다" |
| kind | 필수 값 | "파생 리소스 종류를 선택해주세요" |
| profile | 문자열 길이 1-50 | "프로필명이 올바르지 않습니다" |
| storageKey | 필수 값 | "스토리지 키가 필요합니다" |
| storageKey | 문자열 길이 1-500 | "스토리지 키가 올바르지 않습니다" |
| mimeType | 필수 값 | "MIME 타입이 필요합니다" |
| sizeBytes | 0 이상의 정수 | "파일 크기가 올바르지 않습니다" |
| width | 1 이상의 정수 | "너비가 올바르지 않습니다" |
| height | 1 이상의 정수 | "높이가 올바르지 않습니다" |

## 변환 로직

### toEntity (생성 시)
```typescript
// DTO → Entity 변환
const derivative = new Derivative();
derivative.assetId = dto.assetId;
derivative.kind = dto.kind;
derivative.profile = dto.profile ?? "default";
derivative.storageKey = dto.storageKey;
derivative.mimeType = dto.mimeType;
derivative.sizeBytes = BigInt(dto.sizeBytes);
derivative.width = dto.width ?? null;
derivative.height = dto.height ?? null;
derivative.durationMs = dto.durationMs ?? null;
return derivative;
```

## 사용 예시

### 요청 - 썸네일
```json
{
  "assetId": "550e8400-e29b-41d4-a716-446655440001",
  "kind": "THUMBNAIL",
  "profile": "small",
  "storageKey": "spaces/abc123/thumbnails/2024/02/22/thumb.jpg",
  "mimeType": "image/jpeg",
  "sizeBytes": 10240,
  "width": 150,
  "height": 150
}
```

### 요청 - 트랜스코딩
```json
{
  "assetId": "550e8400-e29b-41d4-a716-446655440002",
  "kind": "TRANSCODE",
  "profile": "hls-720p",
  "storageKey": "spaces/abc123/transcodes/2024/02/22/video.m3u8",
  "mimeType": "application/x-mpegURL",
  "sizeBytes": 5242880,
  "width": 1280,
  "height": 720,
  "durationMs": 150000
}
```

### 응답
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440020",
  "assetId": "550e8400-e29b-41d4-a716-446655440001",
  "kind": "THUMBNAIL",
  "profile": "small",
  "storageKey": "spaces/abc123/thumbnails/2024/02/22/thumb.jpg",
  "mimeType": "image/jpeg",
  "sizeBytes": 10240,
  "width": 150,
  "height": 150,
  "durationMs": null,
  "createdAt": "2026-02-22T10:00:00Z"
}
```

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Entity | Derivative | Entity 변환 |
| Enum | DerivativeKind | 파생 리소스 종류 |

## 구현 체크리스트

- [ ] create-derivative.dto.ts
- [ ] class-validator 데코레이터 (@IsString, @IsEnum, @IsNumber 등)
- [ ] class-transformer 데코레이터 (@Type)
- [ ] Swagger @ApiProperty 데코레이터
- [ ] toEntity() 메서드 구현
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/derivative.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |

# DerivativeResponseDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/derivative/derivative-response.dto.ts

## 역할

파생 리소스 조회 API의 응답 데이터를 구성하는 DTO입니다. 파생 리소스의 기본 정보를 포함합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | required | - | 고유 식별자 |
| assetId | string | required | - | 원본 Asset ID |
| kind | DerivativeKind | required | - | 파생 리소스 종류 |
| profile | string | required | - | 변환 프로필명 |
| storageKey | string | required | - | 스토리지 키 |
| mimeType | string | required | - | MIME 타입 |
| sizeBytes | number | required | - | 파일 크기 (bytes) |
| width | number | optional | - | 너비 (이미지/비디오) |
| height | number | optional | - | 높이 (이미지/비디오) |
| durationMs | number | optional | - | 재생 시간 (비디오) |
| createdAt | Date | required | - | 생성 일시 |

## 변환 로직

### fromEntity (응답 시)
```typescript
// Entity → DTO 변환
const dto = new DerivativeResponseDto();
dto.id = entity.id;
dto.assetId = entity.assetId;
dto.kind = entity.kind;
dto.profile = entity.profile;
dto.storageKey = entity.storageKey;
dto.mimeType = entity.mimeType;
dto.sizeBytes = Number(entity.sizeBytes);
dto.width = entity.width;
dto.height = entity.height;
dto.durationMs = entity.durationMs;
dto.createdAt = entity.createdAt;
return dto;
```

## 사용 예시

### 응답 - 썸네일
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

### 응답 - 트랜스코딩
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440021",
  "assetId": "550e8400-e29b-41d4-a716-446655440002",
  "kind": "TRANSCODE",
  "profile": "hls-720p",
  "storageKey": "spaces/abc123/transcodes/2024/02/22/video.m3u8",
  "mimeType": "application/x-mpegURL",
  "sizeBytes": 5242880,
  "width": 1280,
  "height": 720,
  "durationMs": 150000,
  "createdAt": "2026-02-22T10:00:00Z"
}
```

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Entity | Derivative | Entity 변환 |
| DTO | AbstractDto | 기본 DTO 상속 |
| Enum | DerivativeKind | 파생 리소스 종류 |

## 구현 체크리스트

- [ ] derivative-response.dto.ts
- [ ] AbstractDto 상속
- [ ] Swagger @ApiProperty 데코레이터
- [ ] fromEntity() 정적 메서드
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/derivative.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |

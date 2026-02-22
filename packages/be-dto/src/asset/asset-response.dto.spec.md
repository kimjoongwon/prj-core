# AssetResponseDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/asset/asset-response.dto.ts

## 역할

에셋 조회 API의 응답 데이터를 구성하는 DTO입니다. 기본 메타데이터와 함께 kind에 따른 상세 정보를 포함합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | required | - | 고유 식별자 |
| folderId | string | required | - | 소속 폴더 ID |
| kind | AssetKind | required | - | 에셋 타입 |
| status | AssetStatus | required | - | 업로드 상태 |
| originalName | string | required | - | 원본 파일명 |
| mimeType | string | required | - | MIME 타입 |
| extension | string | optional | - | 파일 확장자 |
| sizeBytes | number | required | - | 파일 크기 (bytes) |
| checksum | string | optional | - | 파일 체크섬 |
| metadata | object | optional | - | 추가 메타데이터 |
| createdAt | Date | required | - | 생성 일시 |
| updatedAt | Date | required | - | 수정 일시 |
| image | ImageResponseDto | optional | - | 이미지 상세 정보 (kind=IMAGE) |
| video | VideoResponseDto | optional | - | 비디오 상세 정보 (kind=VIDEO) |
| document | DocumentResponseDto | optional | - | 문서 상세 정보 (kind=DOCUMENT) |

## 변환 로직

### fromEntity (응답 시)
```typescript
// Entity → DTO 변환
const dto = new AssetResponseDto();
dto.id = entity.id;
dto.folderId = entity.folderId;
dto.kind = entity.kind;
dto.status = entity.status;
dto.originalName = entity.originalName;
dto.mimeType = entity.mimeType;
dto.extension = entity.extension;
dto.sizeBytes = Number(entity.sizeBytes);
dto.checksum = entity.checksum;
dto.metadata = entity.metadata;
dto.createdAt = entity.createdAt;
dto.updatedAt = entity.updatedAt;

// CTI 서브타입 매핑
if (entity.kind === 'IMAGE' && entity.image) {
  dto.image = ImageResponseDto.fromEntity(entity.image);
} else if (entity.kind === 'VIDEO' && entity.video) {
  dto.video = VideoResponseDto.fromEntity(entity.video);
} else if (entity.kind === 'DOCUMENT' && entity.document) {
  dto.document = DocumentResponseDto.fromEntity(entity.document);
}

return dto;
```

## 사용 예시

### 응답 - 이미지 에셋
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "folderId": "550e8400-e29b-41d4-a716-446655440000",
  "kind": "IMAGE",
  "status": "READY",
  "originalName": "banner-image.jpg",
  "mimeType": "image/jpeg",
  "extension": "jpg",
  "sizeBytes": 2456789,
  "checksum": "e99a18c428cb38d5f260853678922e03",
  "metadata": {},
  "createdAt": "2026-02-22T10:00:00Z",
  "updatedAt": "2026-02-22T10:00:00Z",
  "image": {
    "width": 1920,
    "height": 1080,
    "colorSpace": "sRGB"
  }
}
```

### 응답 - 비디오 에셋
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "folderId": "550e8400-e29b-41d4-a716-446655440000",
  "kind": "VIDEO",
  "status": "READY",
  "originalName": "intro-video.mp4",
  "mimeType": "video/mp4",
  "extension": "mp4",
  "sizeBytes": 52428800,
  "createdAt": "2026-02-22T10:00:00Z",
  "updatedAt": "2026-02-22T10:00:00Z",
  "video": {
    "durationMs": 150000,
    "width": 1920,
    "height": 1080,
    "frameRate": 30,
    "codec": "H.264",
    "hasAudio": true
  }
}
```

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Entity | Asset | Entity 변환 |
| DTO | ImageResponseDto | 이미지 상세 정보 |
| DTO | VideoResponseDto | 비디오 상세 정보 |
| DTO | DocumentResponseDto | 문서 상세 정보 |

## 구현 체크리스트

- [ ] asset-response.dto.ts
- [ ] AbstractDto 상속
- [ ] ClassField 데코레이터 (image, video, document)
- [ ] Swagger @ApiProperty 데코레이터
- [ ] fromEntity() 정적 메서드
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |

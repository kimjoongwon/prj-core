# CreateAssetDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/asset/create-asset.dto.ts

## 역할

새로운 에셋(이미지, 비디오, 문서) 생성 시 필요한 데이터를 전달받는 DTO입니다. 업로드 완료 후 메타데이터와 함께 호출됩니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| folderId | string | required, UUID | - | 소속 폴더 ID |
| kind | AssetKind | required, enum | - | 에셋 타입 (IMAGE/VIDEO/DOCUMENT) |
| originalName | string | required, max 255자 | - | 원본 파일명 |
| storageKey | string | required, max 500자 | - | 스토리지 키 |
| mimeType | string | required, max 100자 | - | MIME 타입 |
| extension | string | optional, max 20자 | - | 파일 확장자 |
| sizeBytes | number | required, integer, min 0 | - | 파일 크기 (bytes) |
| checksum | string | optional, max 64자 | - | 파일 체크섬 (MD5/SHA256) |
| metadata | object | optional, JSON | - | 추가 메타데이터 |

## 검증 규칙

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| folderId | UUID 형식 | "폴더 ID가 올바르지 않습니다" |
| folderId | 필수 값 | "폴더를 선택해주세요" |
| kind | Enum 값 (IMAGE/VIDEO/DOCUMENT) | "에셋 타입이 올바르지 않습니다" |
| kind | 필수 값 | "에셋 타입을 선택해주세요" |
| originalName | 문자열 길이 1-255 | "파일명은 1~255자 사이여야 합니다" |
| originalName | 필수 값 | "파일명을 입력해주세요" |
| storageKey | 문자열 길이 1-500 | "스토리지 키가 올바르지 않습니다" |
| storageKey | 필수 값 | "스토리지 키가 필요합니다" |
| mimeType | 문자열 길이 1-100 | "MIME 타입이 올바르지 않습니다" |
| mimeType | 필수 값 | "MIME 타입이 필요합니다" |
| sizeBytes | 0 이상의 정수 | "파일 크기가 올바르지 않습니다" |

## 변환 로직

### toEntity (생성 시)
```typescript
// DTO → Entity 변환
const asset = new Asset();
asset.folderId = dto.folderId;
asset.kind = dto.kind;
asset.status = AssetStatus.UPLOADING; // 기본 업로드 진행 상태
asset.originalName = dto.originalName;
asset.storageKey = dto.storageKey;
asset.mimeType = dto.mimeType;
asset.extension = dto.extension ?? this.extractExtension(dto.originalName);
asset.sizeBytes = BigInt(dto.sizeBytes);
asset.checksum = dto.checksum;
asset.metadata = dto.metadata;
return asset;
```

## 사용 예시

### 요청
```json
{
  "folderId": "550e8400-e29b-41d4-a716-446655440000",
  "kind": "IMAGE",
  "originalName": "banner-image.jpg",
  "storageKey": "spaces/abc123/assets/2024/02/22/banner-image.jpg",
  "mimeType": "image/jpeg",
  "extension": "jpg",
  "sizeBytes": 2456789,
  "checksum": "e99a18c428cb38d5f260853678922e03"
}
```

### 응답
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
  "createdAt": "2026-02-22T10:00:00Z",
  "updatedAt": "2026-02-22T10:00:00Z"
}
```

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Entity | Asset | Entity 변환 |
| Enum | AssetKind | 에셋 타입 검증 |

## 구현 체크리스트

- [ ] create-asset.dto.ts
- [ ] class-validator 데코레이터 (@IsString, @IsEnum, @IsNumber 등)
- [ ] class-transformer 데코레이터 (@Type)
- [ ] Swagger @ApiProperty 데코레이터
- [ ] toEntity() 메서드 구현
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |
| 2026-02-26 | Stage 1 정합화: 기본 상태를 READY에서 UPLOADING으로 수정 | orch-requirement |

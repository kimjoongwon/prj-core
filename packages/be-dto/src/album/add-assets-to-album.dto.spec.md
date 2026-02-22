# AddAssetsToAlbumDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/album/add-assets-to-album.dto.ts

## 역할

앨범에 에셋을 추가할 때 사용하는 DTO입니다. 여러 에셋을 한 번에 추가할 수 있습니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| assetIds | string[] | required, min 1, max 100 | - | 추가할 에셋 ID 목록 |

## 검증 규칙

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| assetIds | 필수 값 | "추가할 에셋을 선택해주세요" |
| assetIds | 최소 1개 | "최소 1개의 에셋을 선택해주세요" |
| assetIds | 최대 100개 | "한 번에 100개까지 추가할 수 있습니다" |
| assetIds | 배열 내 UUID 형식 | "에셋 ID가 올바르지 않습니다" |
| assetIds | 중복 불가 | "중복된 에셋이 포함되어 있습니다" |

## 비즈니스 규칙

- 이미 앨범에 포함된 에셋은 무시 (에러 아님)
- 다른 Space의 에셋은 추가 불가
- 존재하지 않는 에셋 ID는 에러

## 사용 예시

### 요청
```json
{
  "assetIds": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002",
    "550e8400-e29b-41d4-a716-446655440003"
  ]
}
```

### 응답
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "spaceId": "550e8400-e29b-41d4-a716-446655440099",
  "name": "2024 여름 휴가",
  "description": "제주도 여행 사진 모음",
  "coverAssetId": "550e8400-e29b-41d4-a716-446655440001",
  "sortOrder": 0,
  "createdAt": "2026-02-22T10:00:00Z",
  "updatedAt": "2026-02-22T11:00:00Z"
}
```

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| DTO | AlbumResponseDto | 응답 타입 |

## 구현 체크리스트

- [ ] add-assets-to-album.dto.ts
- [ ] class-validator 데코레이터 (@IsArray, @IsUUID, @ArrayMinSize, @ArrayMaxSize)
- [ ] class-transformer 데코레이터 (@Type)
- [ ] Swagger @ApiProperty 데코레이터
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/album.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |

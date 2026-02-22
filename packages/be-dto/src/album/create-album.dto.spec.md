# CreateAlbumDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/album/create-album.dto.ts

## 역할

새로운 앨범을 생성할 때 사용하는 DTO입니다. 에셋을 그룹화하는 독립적인 컬렉션을 만듭니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| name | string | required, max 100자 | - | 앨범명 |
| description | string | optional, max 500자 | - | 앨범 설명 |
| coverAssetId | string | optional, UUID | - | 커버 이미지 Asset ID |

## 검증 규칙

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| name | 필수 값 | "앨범명을 입력해주세요" |
| name | 문자열 길이 1-100 | "앨범명은 1~100자 사이여야 합니다" |
| description | 문자열 길이 0-500 | "설명은 500자 이하여야 합니다" |
| coverAssetId | UUID 형식 | "커버 이미지 ID가 올바르지 않습니다" |

## 변환 로직

### toEntity (생성 시)
```typescript
// DTO → Entity 변환
const album = new Album();
album.name = dto.name;
album.description = dto.description ?? null;
album.coverAssetId = dto.coverAssetId ?? null;
album.sortOrder = 0; // Service에서 다음 순서 계산
return album;
```

## 사용 예시

### 요청 - 기본
```json
{
  "name": "2024 여름 휴가"
}
```

### 요청 - 전체 필드
```json
{
  "name": "2024 여름 휴가",
  "description": "제주도 여행 사진 모음",
  "coverAssetId": "550e8400-e29b-41d4-a716-446655440001"
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
  "updatedAt": "2026-02-22T10:00:00Z"
}
```

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Entity | Album | Entity 변환 |

## 구현 체크리스트

- [ ] create-album.dto.ts
- [ ] class-validator 데코레이터 (@IsString, @IsUUID, @MaxLength)
- [ ] class-transformer 데코레이터 (@Type)
- [ ] Swagger @ApiProperty 데코레이터
- [ ] toEntity() 메서드 구현
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/album.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |

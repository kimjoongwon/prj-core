# AlbumResponseDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/album/album-response.dto.ts

## 역할

앨범 조회 API의 응답 데이터를 구성하는 DTO입니다. 앨범의 기본 정보를 포함합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | required | - | 고유 식별자 |
| spaceId | string | required | - | 소속 Space ID |
| name | string | required | - | 앨범명 |
| description | string | optional | - | 앨범 설명 |
| coverAssetId | string | optional | - | 커버 이미지 Asset ID |
| sortOrder | number | required | - | 정렬 순서 |
| createdAt | Date | required | - | 생성 일시 |
| updatedAt | Date | required | - | 수정 일시 |

## 변환 로직

### fromEntity (응답 시)
```typescript
// Entity → DTO 변환
const dto = new AlbumResponseDto();
dto.id = entity.id;
dto.spaceId = entity.spaceId;
dto.name = entity.name;
dto.description = entity.description;
dto.coverAssetId = entity.coverAssetId;
dto.sortOrder = entity.sortOrder;
dto.createdAt = entity.createdAt;
dto.updatedAt = entity.updatedAt;
return dto;
```

## 사용 예시

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
| DTO | AbstractDto | 기본 DTO 상속 |

## 구현 체크리스트

- [ ] album-response.dto.ts
- [ ] AbstractDto 상속
- [ ] Swagger @ApiProperty 데코레이터
- [ ] fromEntity() 정적 메서드
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/album.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |

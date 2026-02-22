# FolderResponseDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/folder/folder-response.dto.ts

## 역할

폴더 조회 API의 응답 데이터를 구성하는 DTO입니다. 폴더의 기본 정보와 계층 구조 정보를 포함합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | required | - | 고유 식별자 |
| spaceId | string | required | - | 소속 Space ID |
| parentFolderId | string | optional | - | 상위 폴더 ID |
| name | string | required | - | 폴더명 |
| path | string | required | - | 전체 경로 |
| sortOrder | number | required | - | 정렬 순서 |
| createdAt | Date | required | - | 생성 일시 |
| updatedAt | Date | required | - | 수정 일시 |

## 변환 로직

### fromEntity (응답 시)
```typescript
// Entity → DTO 변환
const dto = new FolderResponseDto();
dto.id = entity.id;
dto.spaceId = entity.spaceId;
dto.parentFolderId = entity.parentFolderId;
dto.name = entity.name;
dto.path = entity.path;
dto.sortOrder = entity.sortOrder;
dto.createdAt = entity.createdAt;
dto.updatedAt = entity.updatedAt;
return dto;
```

## 사용 예시

### 응답
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "spaceId": "550e8400-e29b-41d4-a716-446655440099",
  "parentFolderId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "배너",
  "path": "/이미지/배너",
  "sortOrder": 0,
  "createdAt": "2026-02-22T10:00:00Z",
  "updatedAt": "2026-02-22T10:00:00Z"
}
```

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Entity | Folder | Entity 변환 |
| DTO | AbstractDto | 기본 DTO 상속 |

## 구현 체크리스트

- [ ] folder-response.dto.ts
- [ ] AbstractDto 상속
- [ ] Swagger @ApiProperty 데코레이터
- [ ] fromEntity() 정적 메서드
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/folder.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |
